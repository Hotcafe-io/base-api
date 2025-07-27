# 📦 API Base refatorada com snippet `!newroute`

## 🧠 Conceito

Agora **cada arquivo `.ts` dentro de `src/api/...` é uma rota**. O nome e caminho da rota são definidos pela **estrutura de pastas**. Não tem mais controller separado: a função já vai direto no arquivo e é exportada com uma estrutura padrão.

---

## ⚙️ Criando uma Rota com o Snippet

1. Crie um novo arquivo em `src/api/v1/alguma-coisa/nome.ts
    - ` (use a estrutura de pastas que quiser, mas mantenha o padrão de versão `v1` ou `v2` etc.):

    - Exemplo: `src/api/v1/users/create.ts` para criar usuários
        - Isso vai gerar a rota `/api/v1/users/create`

    - Se usar `src/api/v1/alguma-coisa/nome.ts`
        - isso vai ser a rota `/api/v1/alguma-coisa/nome`
2. Digite `!newroute` e aceite o snippet
3. O snippet gera:

```ts
import { Request, Response } from "express";
import { IFunctionDefinition } from "@/types/base";

export async function fn(req: Request, res: Response): Promise<void> {
  try {
    const {} = req.body;

    res.status(200).json({});
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({
      message: "Error processing request",
    });
  }
}

export const functions: IFunctionDefinition[] = [
  {
    method: "POST",
    handler: fn,
    middlewares: [],
    isPublic: true,
  },
];
```

---

## 🧪 Estrutura Esperada

Todo arquivo de rota deve exportar um array `functions` com objetos assim:

- `method`: `"GET"`, `"POST"`, `"PUT"`, `"DELETE"`
- `handler`: função async
- `middlewares`: array de middlewares (se quiser)
- `isPublic`: boolean

O loader (`src/loader/index.ts`) valida tudo isso automaticamente e avisa se tiver erro.

---

## 🔌 Middlewares

Só importar no array `middlewares`. O loader já se encarrega de aplicar:

```ts
import { authenticate } from "@/middlewares/authenticateMiddleware";

middlewares: [authenticate];
```

---

## 📁 Imports com `@`

Tudo usa alias via `@`, configurado no `tsconfig.json`:

```json
"paths": {
  "@/*": ["src/*"]
}
```

---

## 🌍 Variáveis de Ambiente

Todas as envs devem ser registradas em `src/index.ts`:

```ts
const expectedEnvVars = ["MONGO_URL", "PORT", "JWT_SECRET"];
```

Se faltar alguma, o app para e dá erro. Isso garante consistência.

---

## 🧩 Organização

- `services/`: continua com as regras de negócio e funções utilitárias
- `api/`: agora carrega só as rotas direto
- `middlewares/`: plugável direto nas rotas
- `types/`: tipos globais
- `utils/`: helpers diversos

---

## ✅ Vantagens

- Menos boilerplate
- Rápido pra criar rota com `!newroute`
- Validação automática
- Mais legível e consistente
