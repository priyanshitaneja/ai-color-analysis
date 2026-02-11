import { Link } from 'react-router-dom';
import { seasons } from '../../data/seasons';
import type { SeasonId } from '../../types';

interface Props {
  currentSeasonId?: SeasonId;
}

const allSeasons = Object.values(seasons);

export function SeasonLinksGrid({ currentSeasonId }: Props) {
  return (
    <section
      className="squircle-lg border border-gray-200 p-8 sm:p-10"
      aria-label="Explore all seasons"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-center">
        Explore All Seasons
      </h3>
      <p className="text-sm text-gray-600 text-center mt-1">
        Discover the palette for every seasonal color type
      </p>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allSeasons.map((season) => {
          const isCurrent = season.id === currentSeasonId;
          return (
            <Link
              key={season.id}
              to={`/seasons/${season.id}`}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-colors text-gray-800
                ${isCurrent ? 'bg-gray-100 ring-2 ring-violet-300' : 'hover:bg-gray-50 hover:text-gray-900'}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <div className="flex gap-1">
                {season.wowColors.map((color) => (
                  <div
                    key={color.hex}
                    className="w-6 h-6 rounded-full border border-black/5"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-center">
                {season.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
