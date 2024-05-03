// Import the framework and instantiate it
import Fastify from 'fastify'
import * as tmp from "tmp"
import {  execSync } from 'node:child_process';
import fs from 'node:fs/promises';

const fastify = Fastify({
    logger: true
});

tmp.setGracefulCleanup();

fastify.get('/', async function handler (request, reply) {
    reply.body = "test"
})

// Declare a route
fastify.post('/flashdata', async function handler (request, reply) {

    let data = null;
    try {
        const tmpobj = tmp.dirSync({ prefix: "littlefs-", unsafeCleanup: true});
        console.log('Dir: ', tmpobj.name);
        const content = JSON.stringify(request.body);
        await fs.writeFile(`${tmpobj.name}/config.json`, content);


        const tmpFile = tmp.fileSync({prefix: "littlefs-", postfix: "data.bin"});
        console.log('Created temporary filename: ', tmpFile.name);


        execSync(`./mklittlefs/mklittlefs -s 16384 -b 4096 -p 256 -c "${tmpobj.name}" "${tmpFile.name}"`);
        console.log(`file data ${tmpFile.name}`)
        data = await fs.readFile(`${tmpFile.name}`);
        tmpobj.removeCallback();
        tmpFile.removeCallback();
    } catch (err) {
        console.log(err);
    }
    reply.type("application/octet-stream");
    reply.send(data);
})

// Run the server!
try {
    await fastify.listen({ host: "0.0.0.0", port: 3001 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}
