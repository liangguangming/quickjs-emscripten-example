import { getQuickJS, QuickJSContext } from "../quickjs-emscripten";
import { memo } from "../quickjs-emscripten/examples/imports/cdn.esm.sh/v69/react@17.0.2/es2015/react";

let vm: QuickJSContext;

async function getVm() {
  if (vm) {
    return vm;
  }
  let module = await getQuickJS();
  vm = module.newContext();

  return vm;
}


function readFileAsync(file: File, encoding?: string): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (() => {
      resolve(fileReader.result);
    });
  
    fileReader.readAsArrayBuffer(file);
  });
}

const input = document.createElement("input");
input.type = "file";

document.body.appendChild(input);

input.addEventListener("input", async (event) => {
  const text = await readFileAsync(input.files[0]);
  console.log(text);
});

async function test() {
  const ctx = await getVm();
  // const textHandler = ctx.newString("test\u0000demo");
  // console.log("getString: ", ctx.getString(textHandler));

  const memory = ctx.getTestMemory();

  console.log("memory: ", memory);

  const ptr: number = memory.stringToUTF8("testdem\u0000oxxxxxxxxxxxxxu");

  const text = memory.UTF8ToString(ptr);

  // // @ts-ignore
  // const ptr: number = memory.stringToUTF16("testdem\u0000oxxxxxxxxxxxxxu");

  // // @ts-ignore
  // const text = memory.UTF16ToString(ptr);

  console.log("text: ", text);

}

test()
