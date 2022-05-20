import { useInfiniteQuery } from 'react-query';

import InfiniteScroll from 'react-infinite-scroller';
import { Person } from './Person';

const initialUrl = 'https://swapi.dev/api/people/';
const fetchUrl = async (url) => {
  console.log('fetchUrl');

  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const {
    data = { pages: [] },
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    'people',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage, pages) => lastPage.next || undefined,
      getPreviousPageParam: (lastPage, pages) => lastPage.previous,
    }
  );

  if (isLoading) {
    return <div className="loading">... Loading</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {isFetching && <div className="loading">... Loading</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) =>
          pageData.results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hairColor}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
