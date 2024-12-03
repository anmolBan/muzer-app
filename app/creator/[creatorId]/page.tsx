import StreamView from "@/components/StreamView";

export default function StreamViewPage({
    params: {
        creatorId
    }
}: {
    params: {
        creatorId: string;
    };
}) {
    return (
        <div>
            <StreamView creatorId={creatorId} />
        </div>
    );
}

StreamViewPage.displayName = "StreamViewPage";
