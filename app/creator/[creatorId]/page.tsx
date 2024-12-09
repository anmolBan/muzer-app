import StreamView from "@/components/StreamView";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function StreamViewPage({
    params: {
        creatorId
    }
}: {
    params: {
        creatorId: string;
    };
}) {
    const session = await getServerSession(authOptions);
    if(!session?.user){
        redirect("/api/auth/signin");
    }
    return (
        <div>
            <StreamView creatorId={creatorId} />
        </div>
    );
}

StreamViewPage.displayName = "StreamViewPage";
