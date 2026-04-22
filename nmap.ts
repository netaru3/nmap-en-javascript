#!/usr/bin/env node
import ping from 'ping'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';
import net from 'net'
let i=0
const argv = yargs(hideBin(process.argv)).parse()

const argumentos= process.argv.slice(2)

const ip= argumentos[0]

let promesas:Promise<any>[]=[]
if(ip.includes("/")){const rangofake= ip.split("/")
const rangotrue:number=Number(rangofake[1])

const iptotales=2**(32-rangotrue)
let ipiterablefake= ip.split(".")
ipiterablefake.splice(ipiterablefake.length-1,1)

const ipiterabletrue= ipiterablefake.join(".").toString()
try{
    while(i<=iptotales-1){if(i!==0){let ipactual=i
    let res=ping.promise.probe(ipiterabletrue+"."+i,{timeout:1,extra:['-4']}).then(function(res){if(res.alive===true){console.log(ipiterabletrue+"."+ipactual,"host is up")}})
        promesas.push(res)
        if(i%50===0){await Promise.all(promesas)}

}++i}
}catch(error){console.log(error)}}

else{console.log("escaneando la ip")
    while(i<=65535){
        let promesa = new Promise(function(resolve){ const puerto= i; let estado="cerrado"; let servicio="no reconocido"
            let socket= net.createConnection({host:ip,port:puerto,timeout:3000})
            socket.on("connect",function(){estado="filtrado"
                socket.write('GET / HTTP/1.0\r\n\r\n')
            })

            socket.on("data",function(data){estado="abierto"; if(data.toString().includes("HTTP")){servicio="HTTP/HTTPS"}
            if(data.toString().includes("SSH")){servicio="SSH"}
                resolve(`${puerto} ${estado}; servicio: ${servicio}`); socket.destroy(); return
            })
            socket.on("error",function(){ socket.destroy(); resolve(`el puerto:${puerto} está ${estado}`);console.log("error"); return

            })

            socket.on("timeout",function(){resolve(`el puerto:${puerto} está ${estado}`)
                 socket.destroy(); return
            })

            
        }).then(function(conclusion:Promise<String>){if(!conclusion.includes("cerrado")){console.log(conclusion)}});promesas.push(promesa)
        if(i%50===0){await Promise.all(promesas)}; promesas=[]
    ++i}
        await Promise.all(promesas)
}



