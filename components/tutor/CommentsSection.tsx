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
    <div className="bg-white p-6 rounded shadow-lg mt-6 mb-10">
      <h2 className="text-lg font-semibold mb-4">Comentarios</h2>
      <div className="space-y-6">
        {comments.map((comment, idx) => (
          <div
            key={idx}
            className="border-b border-gray-200 pb-4 mb-4 last:border-none"
          >
            <p className="font-semibold">{comment.name}</p>
            <p className="text-sm text-gray-500">{comment.date}</p>
            <p className="text-yellow-500 text-sm">
              {"★".repeat(comment.rating)}
            </p>
            <p className="text-gray-700">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}