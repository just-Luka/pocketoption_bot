export const terminateScript = (message) => {
    console.error(message);
    process.exit(1);
};