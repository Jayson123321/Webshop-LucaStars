import { api } from "@hboictcloud/api";

try {
    api.configure({
        url: "https://api.hbo-ict.cloud",
        apiKey: "pb4a2324_hiikuuziimuu29.Si8Z8ZfIZkmMAmqq",
        database: "pb4a2324_hiikuuziimuu29_dev",
        environment: "dev",
    });
} catch (reason) {
    console.error(reason);
}
