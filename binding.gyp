{
  "targets": [
    {
      "target_name": "stormlib",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [ "ext/stormlib.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "StormLib/src"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "libraries": [],
      "conditions": [
        ["OS=='win'", {
          "libraries": [
            "../StormLib/build/Release/StormLib.lib"
          ],
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1
            }
          }
        }],
        ["OS=='mac' or OS=='linux'", {
          "libraries": [
            "../StormLib/build/libstorm.a",
            "-lz",
            "-lbz2"
          ],
          "cflags": [
            "-fexceptions"
          ],
          "cflags_cc": [
            "-fexceptions"
          ]
        }]
      ]
    }
  ]
}