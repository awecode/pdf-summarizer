export default defineEventHandler(async (event) => {
    return {
        message: await summarize()
    }
    //   const body = await useBody(event);
    //   const { text } = body;
    //   const summary = await summarize(text);
    //   return { summary };
});
