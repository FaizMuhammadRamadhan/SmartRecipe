import { ChefHat, UtensilsCrossed, Leaf, Pizza, Soup } from "lucide-react";

export default function SmartRecipeLoader() {
  const icons = [ChefHat, UtensilsCrossed, Leaf, Pizza, Soup];

  return (
    <div className="relative flex justify-center pt-12 h-screen bg-white overflow-hidden">
      {/* Bouncing Food Icons */}
      <div className="flex space-x-4 z-10">
        {icons.map((Icon, i) => (
          <Icon
            key={i}
            size={36}
            className="text-orange-500 animate-bounce-rotate"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      {/* Steam & Pan */}
      <div className="absolute top-20">
        {/* Steam */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-6 bg-gray-300 opacity-60 rounded-full animate-steam"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-rotate {
          0% {
            transform: scale(1) rotate(0deg) translateY(0);
          }
          50% {
            transform: scale(1.3) rotate(180deg) translateY(-10px);
          }
          100% {
            transform: scale(1) rotate(360deg) translateY(0);
          }
        }
        .animate-bounce-rotate {
          animation: bounce-rotate 1.5s infinite ease-in-out;
        }

        @keyframes steam {
          0% {
            opacity: 0;
            transform: translateY(0) scaleX(1);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-12px) scaleX(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-25px) scaleX(1);
          }
        }
        .animate-steam {
          animation: steam 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
