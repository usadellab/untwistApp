// PlinkWorker.js

// import Plink from '/wasm/plink.js';
// import Plink from '../wasm/plink';

// PlinkWorker.js
importScripts('/wasm/plink.js');

onmessage = async (e) => {
    console.log('I am plink worker printing message from main thread', e)
    if(e.data.cmd === 'instantiate'){

        console.log(Module)

        // Plink().then(Module => {
        //     console.log(Module)
        // })



   
    
        console.log('Module is initialized')
        
    }


}







// // if( 'function' === typeof importScripts) {
// //     importScripts('/wasm/plink.js');
// // }

// // In your Web Worker file (e.g., plinkWorker.js)


// import Plink from '/wasm/plink.js';


// self.onmessage = async (event) => {

//     try {
//         console.log(event.data)

//     //   // Fetch the wasm file
//     //   const response = await fetch('/wasm/plink.js');
//     //   const wasmArrayBuffer = await response.arrayBuffer();
  
//     //   // Instantiate the wasm module
//     //   const wasmModule = await WebAssembly.instantiate(wasmArrayBuffer, {});
  
//     //   // You can now access the exports from the wasm module
//     //   const exports = wasmModule.instance.exports;
  
//     //   // Perform your wasm-related tasks here using the exports
//     //   console.log(exports)

//     // const Plink = await import('/wasm/plink.js');
//     const wasmModule = await Plink();

//     console.log(wasmModule)


  
//       // Send the result back to the main thread
//       self.postMessage('Wasm task completed successfully.');
//     } catch (error) {
//       console.error('Error loading wasm:', error);
//       self.postMessage('Error loading wasm.');
//     }
//   };

  


// //     function runPlinkInWorker(){
// //     // var Module = await Plink();
// //     Plink().then(Module =>{
// //         console.log(Module)
// //     })
// //     // var pedFile ="unt54-10k.vcf";
// //     // var famFile ="UNT54.fam";


// //     // let files = [ pedFile, famFile]; 

// //     // for (let i = 0; i < files.length; i++) {
// //     // let file = files[i];
// //     // console.log("Hi this is my ped file",file);

// //     // fetch(file)
// //     //     .then(response => response.text())
// //     //     .then(responseText => 
// //     //         {
// //     //             Module.FS.createDataFile(
// //     //                 ".", // folder 
// //     //                 file, // filename
// //     //                 responseText, // content
// //     //                 true, // read
// //     //                 true // write
// //     //             );


// //     //             if(Module.FS.readdir('.').includes(['unt54-10k.vcf', 'UNT54.fam'])){
// //     //                 console.log('Before Analysis', Module.FS.readdir('.'));

// //     //                 // console.log(Module.callMain(['--vcf', 'unt54-10k.vcf', '--linear', '--all-pheno', '--pheno', 'UNT54.fam','--double-id','--allow-extra-chr', '--threads','4']));
    
// //     //                 console.log('After Analysis', Module.FS.readdir('.'));
// //     //             }
// //     //         }           
// //     //         )
// //     // }
// // }



// // self.onmessage = function (e) {
// //     const result = e.data + ' processed by the Web Worker';
// //     runPlinkInWorker()



// //     postMessage(result);
// //   };

  

