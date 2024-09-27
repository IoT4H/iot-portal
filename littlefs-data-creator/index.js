// Import the framework and instantiate it
import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import * as tmp from "tmp"
import {  execSync } from 'child_process';
import * as fs from 'fs';
import { platform } from 'node:os';

const fastify = Fastify({
    logger: true
});

tmp.setGracefulCleanup();

console.info(`creator started on ${platform()}`)


await fastify.register(cors, {
    // put your options here
    origin: ["*"]
})

fastify.get('/littlefs.bin', async function handler (request, reply) {
    reply.send("alive");
})

// Declare a route
fastify.post('/littlefs.bin', async function handler (request, reply) {

    console.info("request received")

    try {

        const data = request.body || "{}";
        console.info(`data ${data}`)

        const tmpobj = tmp.dirSync({ prefix: "littlefs", unsafeCleanup: true});
        console.info('Created Dir: ', tmpobj.name);

        fs.writeFileSync(`${tmpobj.name}/config.json`, data);


        const tmpFile = tmp.fileSync({ postfix: "littlefs.bin"});
        console.info('Created temporary filename: ', tmpFile.name);


        let mklittlefsCommandPath;
        if((platform() === 'win32')) { // WINDOWS SYSTEM
            mklittlefsCommandPath = "mklittlefs\\mklittlefs.exe"
        } else { // LINUX Systems
            mklittlefsCommandPath = "./mklittlefs/mklittlefs"
        }

        const command = `${mklittlefsCommandPath} -p 256 -b 4096 -s 61440 -d 5 -c "${tmpobj.name}" "${tmpFile.name}"`;
        console.info(`littlefs create command: ${command}`)
        execSync(command);

        console.info(`file data ${tmpFile.name}`)
        const stream = fs.createReadStream(`${tmpFile.name}`);
        reply.then(() => {

            // clean up files

            tmpobj.removeCallback();
            tmpFile.removeCallback();
        })
        return reply.type('application/octet-stream').send(stream)
    } catch (err) {
        console.log(err);
        
    }
})

// Run the server!
try {
    await fastify.listen({ host: "0.0.0.0", port: 3001 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}
