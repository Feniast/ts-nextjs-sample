# ts-nextjs-sample
Next.js typescript sample project

## Dependencies

- styled-components
- redux
- axios

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

0. You can adjust anything according to your taste. The following are suggestions
1. You can add sass or css files to `/src/styles` and import them in `_app.tsx`.
2. redux related files are put at `/src/store`
3. declare any business related types at `/src/lib/model`
4. declare any api related request & response type at `/src/lib/api/types.ts`
5. change default api backend address at `/src/lib/config.ts`. 
**API_BACKEND_SERVER_ADDR** is for SSR, **API_BACKEND_CLIENT_ADDR** is for CSR. You may also declare them in an `.env` file to override default values.
6. modify the logic of api client `onResp` and `onError` method in the `/src/lib/api/client.ts` file according to your api protocols.
7. declare your api definitions in the `/src/lib/api/index.ts`. There is already an example in it.
8. If you want to redirect to error page in the page initialzation phase (getInitialProps), throw a HttpError declared in the `/src/lib/http-error.ts` file. Assign appropriate status code and message to the HttpError instance.