#include <napi.h>
#define __STORMLIB_NO_STATIC_LINK__
#include <StormLib.h>
#ifdef _WIN32
#include <windows.h>
#endif

namespace {

std::string GetNativePath(Napi::Env env, const Napi::Value &value) {
#ifdef _WIN32
  std::u16string widePath = value.As<Napi::String>().Utf16Value();
  if (widePath.empty()) {
    return std::string();
  }

  int requiredSize = WideCharToMultiByte(
      CP_ACP,
      0,
      reinterpret_cast<LPCWCH>(widePath.c_str()),
      -1,
      nullptr,
      0,
      nullptr,
      nullptr);

  if (requiredSize == 0) {
    Napi::Error::New(env, "Failed to convert path to system encoding").ThrowAsJavaScriptException();
    return std::string();
  }

  std::string nativePath(static_cast<size_t>(requiredSize - 1), '\0');
  int written = WideCharToMultiByte(
      CP_ACP,
      0,
      reinterpret_cast<LPCWCH>(widePath.c_str()),
      -1,
      nativePath.data(),
      requiredSize,
      nullptr,
      nullptr);

  if (written == 0) {
    Napi::Error::New(env, "Failed to convert path to system encoding").ThrowAsJavaScriptException();
    return std::string();
  }

  return nativePath;
#else
  return value.As<Napi::String>().Utf8Value();
#endif
}

}  // namespace

Napi::Value CreateArchive(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 3) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  DWORD flags = info[1].As<Napi::Number>().Uint32Value();
  DWORD maxFileCount = info[2].As<Napi::Number>().Uint32Value();
  std::string filename = GetNativePath(env, info[0]);
  if (env.IsExceptionPending()) {
    return env.Null();
  }

  HANDLE hMpq;
  if (SFileCreateArchive(filename.c_str(), flags, maxFileCount, &hMpq)) {
    return Napi::Number::New(env, reinterpret_cast<uintptr_t>(hMpq));
  } else {
    Napi::Error::New(env, "Failed to create archive").ThrowAsJavaScriptException();
    return env.Null();
  }
}

Napi::Value OpenArchive(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 3) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  DWORD priority = info[1].As<Napi::Number>().Uint32Value();
  DWORD flags = info[2].As<Napi::Number>().Uint32Value();
  std::string filename = GetNativePath(env, info[0]);
  if (env.IsExceptionPending()) {
    return env.Null();
  }

  HANDLE hMpq;
  if (SFileOpenArchive(filename.c_str(), priority, flags, &hMpq)) {
    return Napi::Number::New(env, reinterpret_cast<uintptr_t>(hMpq));
  } else {
    Napi::Error::New(env, "Failed to open archive").ThrowAsJavaScriptException();
    return env.Null();
  }
}

Napi::Value CloseArchive(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hMpq = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());

  if (SFileCloseArchive(hMpq)) {
    return Napi::Boolean::New(env, true);
  } else {
    return Napi::Boolean::New(env, false);
  }
}

Napi::Value AddFile(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 4) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hMpq = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());
  std::string filename = GetNativePath(env, info[1]);
  if (env.IsExceptionPending()) {
    return env.Null();
  }

  std::string archivedName = info[2].As<Napi::String>().Utf8Value();
  DWORD flags = info[3].As<Napi::Number>().Uint32Value();
  if (SFileAddFileEx(hMpq, filename.c_str(), archivedName.c_str(), flags, MPQ_COMPRESSION_ZLIB, MPQ_COMPRESSION_NEXT_SAME)) {
    return Napi::Boolean::New(env, true);
  } else {
    return Napi::Boolean::New(env, false);
  }
}

Napi::Value ExtractFile(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 3) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hMpq = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());
  std::string archivedName = info[1].As<Napi::String>().Utf8Value();
  std::string filename = GetNativePath(env, info[2]);
  if (env.IsExceptionPending()) {
    return env.Null();
  }

  if (SFileExtractFile(hMpq, archivedName.c_str(), filename.c_str(), SFILE_OPEN_FROM_MPQ)) {
    return Napi::Boolean::New(env, true);
  } else {
    return Napi::Boolean::New(env, false);
  }
}

Napi::Value ListFiles(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hMpq = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());
  SFILE_FIND_DATA findFileData;
  HANDLE hFind;
  Napi::Array fileList = Napi::Array::New(env);

  hFind = SFileFindFirstFile(hMpq, "*", &findFileData, NULL);
  if (hFind != NULL) {
    uint32_t index = 0;
    do {
      fileList.Set(index++, Napi::String::New(env, findFileData.cFileName));
    } while (SFileFindNextFile(hFind, &findFileData));

    SFileFindClose(hFind);
  }

  return fileList;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "createArchive"), Napi::Function::New(env, CreateArchive));
  exports.Set(Napi::String::New(env, "openArchive"), Napi::Function::New(env, OpenArchive));
  exports.Set(Napi::String::New(env, "closeArchive"), Napi::Function::New(env, CloseArchive));
  exports.Set(Napi::String::New(env, "addFile"), Napi::Function::New(env, AddFile));
  exports.Set(Napi::String::New(env, "extractFile"), Napi::Function::New(env, ExtractFile));
  exports.Set(Napi::String::New(env, "listFiles"), Napi::Function::New(env, ListFiles));
  return exports;
}

NODE_API_MODULE(stormlib, Init)