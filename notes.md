# React Query

[https://tkdodo.eu/blog/practical-react-query](https://tkdodo.eu/blog/practical-react-query)

### **Overview**

- Caching the data
- Prefetch data, put it in the cache. When user need to data, app can get data from the cache and user doesn’t have to wait for the response
- Maintain loading & error states for every requests
- Fetch data in pieces when it’s needed by the user for pagination or infinite loop
- Retry on error

### **Core concepts**

- Queries
- Mutations
- Query Invalidation

### **Getting started**

`QueryClient` used to interact with a cache

`QueryClientProvider` component used to connect and provide a `QueryClient` to your application

Wrap your app with QueryClientProvider component and pass a queryClient

```jsx
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

function App() {
	const queryClient = new QueryClient();

	<QueryClientProvider client={queryClient}>
		<div className="App">
			
		</div>
		<ReactQueryDevtools />
	</QueryClientProvider>
}
```

`useQuery` 

```jsx
const { data, error, isError, isLoading, isPreviousData } = useQuery(
	'posts',
	fetchPosts
);

// Anonymous function to pass parameters
const { data, error, isError, isLoading, isPreviousData } = useQuery(
	['posts', currentPage],
	() => fetchPosts(currentPage)
);
```

`prefetchQuery`

used to prefetch the data of next page, so when user are in the current page, the data of the next is ready in the cache. Coming with `keepPreviousData` can make a smooth pagination. 

```jsx
const queryClient = useQueryClient();

useEffect(() => {
	if (currentPage < maxPostPage) {
		const nextPage = currentPage + 1;
    queryClient.prefetchQuery(['posts', nextPage], () =>
	    fetchPosts(nextPage)
    );
  }
}, [currentPage, queryClient]);
```

`useIsFetching` is a pretty cool hook which help you to get the loading status and then show `<Spinner />` or `<Loading />` component. It is really helpful as you can centralize fetching indicator

💡 `keepPreviousData` is only useful if background doesn’t change.
  - In our blog post app, it will provide a good experience for user if we keep data from current page, before go to the next page
  - However, in lazy days app, it is not a good idea to use this option as the calendar and day will be change month by month.