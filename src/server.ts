import app from "./index";
import { env } from "./env";

app.listen(env.PORT, () => {
  console.log(`Local server running on http://localhost:${env.PORT}`);
});
