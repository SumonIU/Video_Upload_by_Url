import chalk from "chalk"
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class WebhookController {
     public async webhook({ request, response }: HttpContextContract){
    console.log('Webhook received:');
    console.log(request.all());

    // You can handle different statuses here
    const { Status } = request.all();
    if(Status=== 0){
        console.log(`video is queued for encoding`)
    }
    else if(Status===1){
        console.log(`video is processing`)
    }
    else if(Status===2){
        console.log(`video is encoding`)
    }
    else if(Status===3){
        console.log(`video encoding has finished`)
    }
    else if(Status===4){
        console.log(chalk.green(`video Resolution finished`))
    }
    else if(Status===5){
        console.log(chalk.red("video uploading has Failed!"))
    }
    // Respond 200 OK to Bunny.net
    return response.status(200).send('OK');
}
}