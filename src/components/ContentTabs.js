import React from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { User, Star } from 'react-feather';

const ContentTabs = ({ item, detailedOverview, showFullOverview, setShowFullOverview, cast, crew, reviews, similar, handleListItemClick }) => {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        {['Overview', 'Cast & Crew', 'Reviews', 'Similar'].map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${selected
                ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        <Tab.Panel>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose dark:prose-invert max-w-none"
          >
            <div className="relative">
              <p className="text-gray-600 dark:text-gray-300">
                {showFullOverview
                  ? detailedOverview
                  : (detailedOverview?.length > 300
                      ? `${detailedOverview.slice(0, 300)}...`
                      : detailedOverview)}
              </p>
              {detailedOverview?.length > 300 && (
                <button
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="mt-2 text-blue-500 hover:text-blue-600 dark:text-blue-400
                    dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  {showFullOverview ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item?.genres?.map((genre) => (
                <motion.span
                  key={genre.id}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm
                    cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title={`View more ${genre.name} content`}
                >
                  {genre.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </Tab.Panel>
        <Tab.Panel>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.map((person) => (
                  <motion.div
                    key={person.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
                  >
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="p-2 text-center">
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{person.character}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Crew</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {crew.map((person) => (
                  <motion.div
                    key={`${person.id}-${person.job}`}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
                  >
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="p-2 text-center">
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{person.job}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{review.author}</h4>
                        {review.author_details?.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span>{review.author_details.rating}/10</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {review.content.length > 300
                          ? `${review.content.slice(0, 300)}...`
                          : review.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No reviews available yet.
              </div>
            )}
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {similar.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => handleListItemClick(item)}
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src = '/path-to-fallback-image.jpg'; // Add a fallback image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 p-3">
                      <h4 className="text-white font-semibold">{item.title || item.name}</h4>
                      <p className="text-gray-200 text-sm">
                        {new Date(item.release_date || item.first_air_date).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default ContentTabs;
