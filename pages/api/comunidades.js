import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {

    if(request.method === 'POST') {
        const TOKEN = '17b1d18ec6711e36f3e30236358822';
        const client = new SiteClient(TOKEN);

        const resgistroCriado = await client.items.create({
            itemType: "972783", //MODEL ID CMS
            ...request.body,
            
            //title: "Comunidade teste",
            //imageUrl:"https://github.com/ViictorHFz.png",
            //creatorSlug: "ViictorHFz"
        })

        console.log(resgistroCriado)
        
        console.log(TOKEN)
        response.json({
            dados: 'Algum dado qualquer',
            resgistroCriado: resgistroCriado
        })
        return;
    }

    response.status(404).json({
        message: 'SAI DAQUI RAPAZ!'
    })
}