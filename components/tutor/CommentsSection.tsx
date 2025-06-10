import Image from "next/image";

interface Comment {
  name: string;
  profilePicture: string;
  date: string;
  rating: number;
  text: string;
}

interface CommentsSectionProps {
  comments: Comment[];
}

export default function CommentsSection({ comments }: CommentsSectionProps) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6">Comentarios</h2>
      <div className="space-y-6">
        {comments.map((comment, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-md shadow-sm mb-4 transition-transform transform hover:scale-105"
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 mr-3 flex-shrink-0">
                  <Image
                    src={comment.profilePicture}
                    alt={`${comment.name} profile picture`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/40/40";
                    }}
                  />
              </div>
              <div>
                <p className="font-semibold text-lg">{comment.name}</p>
                <div className="flex items-center">
                  <p className="text-yellow-400 mr-2">
                    {"★".repeat(comment.rating)}
                  </p>
                  <p className="text-xs text-gray-500">{comment.date}</p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-sm">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}