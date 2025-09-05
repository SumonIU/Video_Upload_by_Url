import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class WebhookController {
     public async webhook({ request, response }: HttpContextContract){
    console.log('Webhook received:');
    console.log(request.all());

    // You can handle different statuses here
    const { VideoLibraryId, VideoGuid, Status } = request.all();
    if (Status === 3) {
        console.log(`Video ${VideoGuid} finished processing!`);
    }

    // Respond 200 OK to Bunny.net
    return response.status(200).send('OK');
}
}