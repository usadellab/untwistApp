// onmessage = async function (event) {

//     if (event.data.cmd === 'calculateHweMap') {
//         // console.log('The Chrom Map worker started')

//         var chromosomeData = {}

//         const chrLengths = event.data.ChrLengths;
//         const data = event.data.hweData;
//         const threshold =  0.05 / data.length;  // 0.0000000000000005 this threshold is for testing ; 
//         data
//             .filter(record => parseFloat(record.P) < parseFloat(threshold))
//             .map(record => {
//                 let name = `Chr ${record.SNP.split('_')[0]}`
//                 let pos = record.SNP.split('_')[1]
//                 try{
//                     chromosomeData[name].positions.push(pos)
//                 }catch{
//                     chromosomeData[name] = {}
//                     chromosomeData[name]['positions'] = []
//                     chromosomeData[name]['name'] = name
//                     chromosomeData[name]['length'] = chrLengths[name]
//                     chromosomeData[name].positions.push(pos)
//                 }
//             })
//             // console.log('The Chrom Map worker finished')
//             postMessage({ cmd: 'processedHweMap', result: Object.values(chromosomeData) });
//             console.log('chromosome map worker is done')
//     }

// };


onmessage = async function (event) {

    if (event.data.cmd === 'calculateHweMap') {
        // console.log('The Chrom Map worker started')

        var chromosomeData = {}

        const chrLengths = event.data.ChrLengths;
        const data = event.data.hweData;
        const threshold =  0.05 / data.length;  // 0.0000000000000005 (this threshold is for testing) 

        const maxLength = Math.max(...Object.values(chrLengths)) ; // Find the maximum chromosome length       
        data
            .filter(record => parseFloat(record.P) < parseFloat(threshold))
            .map(record => {
                let name = `Chr ${record.SNP.split('_')[0]}`
                let pos = record.SNP.split('_')[1]
                try{
                    // chromosomeData[name].positions.push(pos)
                    chromosomeData[name]['gradient'].push(`rgba(255, 255, 255, 1) ${pos-1}`)
                    chromosomeData[name]['gradient'].push(`rgba(0, 0, 0, 1) ${pos}`)
                    chromosomeData[name]['gradient'].push(`rgba(0, 0, 0, 1) ${pos +1}`)
                    chromosomeData[name]['gradient'].push(`rgba(255, 255, 255, 1) ${pos +1}`)

                }catch{
                    chromosomeData[name] = {
                        // 'svg' : `<svg width="100%" height="100%" viewBox="0 0 ${maxLength} 100">`,
                        'gradient' : ['rgba(255, 255, 255, 1) 0',]
                    }
                    // chromosomeData[name]['positions'] = []
                    chromosomeData[name]['name'] = name
                    chromosomeData[name]['length'] = chrLengths[name]
                    // chromosomeData[name].positions.push(pos)
                    chromosomeData[name]['gradient'].push(`rgba(255, 255, 255, 1) ${pos-1}`)
                    chromosomeData[name]['gradient'].push(`rgba(0, 0, 0, 1) ${pos}`)
                    chromosomeData[name]['gradient'].push(`rgba(0, 0, 0, 1) ${pos +1}`)
                    chromosomeData[name]['gradient'].push(`rgba(255, 255, 255, 1) ${pos +1}`)



                }
            })

        var svgString = `<svg width="100%" height="100%" viewBox="0 0 ${maxLength} 410">`
        y = 0
        Object.values(chromosomeData).forEach(chr => {
            svgString = svgString + `<rect id=${chr.name} x="0" y=${y} width=${chr.length} height="18" fill=${chr.gradient} />`
            y = y + 20
            
        });
        svgString = svgString + '</svg>'
        // console.log('The Chrom Map worker finished')
        // postMessage({ cmd: 'processedHweMap', result: Object.values(chromosomeData) });
        postMessage({ cmd: 'processedHweMap', result: svgString });

        console.log('chromosome map worker is done')
    }

};



