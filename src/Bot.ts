import mineflayer from "mineflayer";
import { Entity } from "prismarine-entity";
import { Vec3 } from "vec3";

export class Bot
{
  bot: mineflayer.Bot;
  initialized: boolean;

  constructor(login: string, host: string, port: number, password?: string)
  {
    console.log(`Starting bot '${login}' on ${host}:${port}`);
    this.initialized = false;

    this.bot = mineflayer.createBot({
      host: host,
      port: port,
      username: login,
      password: password,
      version: undefined,
    });

    this.bot.on("chat", (username, message) => this.onChat(username, message));
    this.bot.on("entityHurt", (entity) => this.onEntityHurt(entity));
    this.bot.on("spawn", () => this.onSpawn());
    this.bot.on("kicked", () => this.onKick());
  }

  isReady(): boolean
  {
    return this.initialized;
  }

  onSpawn(): void
  {
    if (this.initialized) return;
    this.initialized = true;

    this.logStats();
  }

  logout(): void
  {
    this.onKick();
    this.bot.quit();
  }

  onKick(): void
  {
    this.initialized = false;
  }

  logStats(): void
  {
    console.log(`Joined server.`);
    console.log(`Username: ${this.bot.username}`);
    console.log(`Game Mode: ${this.bot.game.gameMode}`);
    console.log(`World: ${this.bot.game.dimension}`);
    console.log(`Difficulty: ${this.bot.game.difficulty}`);
    console.log(`Version: ${this.bot.version}`);

    let playerNames = Object.keys(this.bot.players);
    console.log(`Online Players: ${playerNames.length}`);

    for (let playerName of playerNames)
    {
      console.log(`  - ${playerName}`);
    }
  }

  onChat(username: string, message: string): void
  {
    if (username === this.bot.username) return;
    this.bot.chat(message);
  }

  onEntityHurt(entity: Entity): void
  {
    if (entity !== this.bot.entity) return;
    this.bot.chat("Ow!");
  }

  lookAtPosition(position: Vec3): void
  {
    this.bot.lookAt(position);
  }

  lookAtEntity(entity: Entity): void
  {
    // @ts-ignore
    this.bot.lookAt(entity.position.offset(0, entity.height, 0));
  }
}
