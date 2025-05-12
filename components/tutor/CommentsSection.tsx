// components/tutor/CommentsSection.tsx
interface Comment {
  name: string;
  date: string;
  rating: number;
  text: string;
}

interface CommentsSectionProps {
  comments: Comment[];
}

export default function CommentsSection({ comments }: CommentsSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comentarios</h2>
      <div className="space-y-6">
        {comments.map((comment, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-md shadow-sm mb-4"
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <p className="font-semibold">{comment.name}</p>
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