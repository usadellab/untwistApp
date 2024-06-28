export default function YouTube({id}) {
    return (
        <iframe
            className="w-full aspect-video"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            width="80%"
            height="500px"
        ></iframe>
    );
}