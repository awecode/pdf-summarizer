export default defineEventHandler(async (event) => {
    return {
        message: await summarize("./sample.pdf")
    }
    //   const body = await useBody(event);
    //   const { text } = body;
    //   const summary = await summarize(text);
    //   return { summary };
});
