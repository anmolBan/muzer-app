import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";

const getYTPreview = zod.object({
    videoId: zod.string()
});

export async function POST(req: NextRequest){
    try{
        const reqBody = await req.json();
        const parsedBody = getYTPreview.parse(reqBody);
        const getStreamData = await axios(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${parsedBody.videoId}&key=${process.env.YOUTUBE_API_KEY}`);
        const bigImg = getStreamData.data.items[0].snippet.thumbnails.maxres.url;
        const title = getStreamData.data.items[0].snippet.title;
        return NextResponse.json({
            thumbnail: bigImg,
            title 
        }, {
            status: 200
        });
    } catch(error){
        console.error(error);
        return NextResponse.json({
            message: "Error getting video review"
        }, {
            status: 400
        });
    }
}