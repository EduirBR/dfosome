# DFO Open API - Endpoints

Documentación oficial: https://www.dfoneople.com/developers/contents/apiDocs

- **Base URL:** `https://api.dfoneople.com`
- **Autenticación:** API Key. Se emite tras el login y el registro de una aplicación en el portal de desarrolladores.
- **Nota general:** Los parámetros de tipo cadena requieren URL encoding.

## Índice

| # | Recurso | Endpoint |
|---|---------|----------|
| 01 | Server Info | `GET /df/servers` |
| 02 | Search Character | `GET /df/servers/:serverId/characters` |
| 03 | Character "Basic Information" | `GET /df/servers/:serverId/characters/:characterId` |
| 04 | Character "Status" | `GET /df/servers/:serverId/characters/:characterId/status` |
| 05 | Equipped Equipment | `GET /df/servers/:serverId/characters/:characterId/equip/equipment` |
| 06 | Equipped Avatar | `GET /df/servers/:serverId/characters/:characterId/equip/avatar` |
| 07 | Equipped Creature | `GET /df/servers/:serverId/characters/:characterId/equip/creature` |
| 08 | Equipped Oath | `GET /df/servers/:serverId/characters/:characterId/equip/oath` |
| 09 | Equipped Mist Assimilation | `GET /df/servers/:serverId/characters/:characterId/equip/mist-assimilation` |
| 10 | Skill Style | `GET /df/servers/:serverId/characters/:characterId/skill/style` |
| 11 | Buff Equipment | `GET /df/servers/:serverId/characters/:characterId/skill/buff/equip/equipment` |
| 12 | Buff Avatar | `GET /df/servers/:serverId/characters/:characterId/skill/buff/equip/avatar` |
| 13 | Buff Creature | `GET /df/servers/:serverId/characters/:characterId/skill/buff/equip/creature` |
| 14 | Character Fame | `GET /df/servers/:serverId/characters-fame` |
| 15 | Search Item | `GET /df/items` |
| 16 | Item Information | `GET /df/items/:itemId` |
| 17 | Item Shop Sell Information | `GET /df/items/:itemId/shop` |
| 18 | Search Multiple Item Information | `GET /df/multi/items` |
| 19 | Item Hashtag | `GET /df/item-hashtag` |
| 20 | Search Set Items | `GET /df/setitems` |
| 21 | Set Item Information | `GET /df/setitems/:setItemId` |
| 22 | Class Information | `GET /df/jobs` |
| 23 | Skill List Per Class | `GET /df/skills/:jobId` |
| 24 | Skill Information Per Class | `GET /df/skills/:jobId/:skillId` |
| 25 | Multiple Skill Information | `GET /df/multi/skills/:jobId` |

---

## 01. Server Info

`GET https://api.dfoneople.com/df/servers`

Lista de servidores del juego.

| Variable | Tipo | Descripción | Obligatorio | Default |
|----------|------|-------------|:-----------:|:-------:|
| - | - | Sin parámetros | - | - |

---

## 02. Search Character

`GET https://api.dfoneople.com/df/servers/:serverId/characters`

Búsqueda de personajes.

| Variable | Tipo | Descripción | Obligatorio | Default | Máx |
|----------|------|-------------|:-----------:|:-------:|:---:|
| serverId | String | **Server ID** (ver `/df/servers`) — `all`: buscar en todos los servidores | Y | - | - |
| characterName | String | Nombre del personaje (Requiere URL encoding) | Y | - | - |
| jobId | String | Código único de clase del personaje | - | - | - |
| jobGrowId | String | Código único de avance de clase (requiere `jobId`) | - | - | - |
| isAllJobGrow | Boolean | Traer todos los avances relacionados cuando se ingresa `jobGrowId` | - | false | - |
| wordType | String | Tipo de búsqueda: `match`, `full` | - | match | - |
| limit | Integer | Número de filas a retornar | - | 10 | 50 |

---

## 03. Character "Basic Information"

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId`

Información básica del personaje.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 04. Character "Status"

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/status`

> **Nota:** Solo se proveen datos de personajes que iniciaron sesión dentro de un período de 1 año. La información de stats se basa en el último login y puede diferir o no estar disponible según las circunstancias.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 05. Equipped Equipment

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/equip/equipment`

Equipamiento equipado del personaje.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 06. Equipped Avatar

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/equip/avatar`

Avatares equipados del personaje.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 07. Equipped Creature

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/equip/creature`

Criatura equipada del personaje.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 08. Equipped Oath

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/equip/oath`

Juramento equipado (Oath/계약) del personaje.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 09. Equipped Mist Assimilation

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/equip/mist-assimilation`

Equipamiento de asimilación de niebla (Mist Assimilation) del personaje.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 10. Skill Style

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/skill/style`

Estilo de habilidades del personaje.

> **Nota:** Los **potenciadores de habilidades (skill enhancements)** a través de objetos/equipamiento están **excluidos**.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 11. Buff Equipment

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/skill/buff/equip/equipment`

Equipamiento de buff del personaje.

> **Nota:** La información de valor de skill buff se basa en el último login y puede diferir o no estar disponible según las circunstancias.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 12. Buff Avatar

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/skill/buff/equip/avatar`

Avatares de buff del personaje.

> **Nota:** La información de valor de skill buff se basa en el último login y puede diferir o no estar disponible según las circunstancias.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 13. Buff Creature

`GET https://api.dfoneople.com/df/servers/:serverId/characters/:characterId/skill/buff/equip/creature`

Criatura de buff del personaje.

> **Nota:** La información de valor de skill buff se basa en el último login y puede diferir o no estar disponible según las circunstancias.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| serverId | String | **Server ID** (ver `/df/servers`) | Y |
| characterId | String | Código único del personaje | Y |

---

## 14. Character Fame

`GET https://api.dfoneople.com/df/servers/:serverId/characters-fame`

Búsqueda de personajes por fama.

> **Notas:**
> - Solo se pueden buscar personajes de nivel 110 o superior.
> - Solo se provee data de personajes que iniciaron sesión dentro de 90 días.
> - El rango máximo de búsqueda se limita a 10,000.
> - Ej.: una petición `minFame: 30000, maxFame: 50000` ajusta el rango y devuelve `minFame: 40000, maxFame: 50000`.

| Variable | Tipo | Descripción | Obligatorio | Default | Máx |
|----------|------|-------------|:-----------:|:-------:|:---:|
| serverId | String | **Server ID** — `all`: buscar en todos los servidores | Y | - | - |
| minFame | Integer | Mínimo del rango de fama | - | maxFame - 10000 | - |
| maxFame | Integer | Máximo del rango de fama | - | Fama más alta del juego (40,000 o más) | - |
| jobId | String | Código único de clase del personaje | - | - | - |
| jobGrowId | String | Código único de avance de clase (requiere `jobId`) | - | - | - |
| isAllJobGrow | Boolean | Traer todos los avances relacionados cuando se ingresa `jobGrowId` | - | false | - |
| isBuff | Boolean | Solo Buffer (`true`), solo DPS (`false`), todos (sin input) | - | - | - |
| limit | Integer | Número de filas a retornar | - | 10 | 200 |

---

## 15. Search Item

`GET https://api.dfoneople.com/df/items`

Búsqueda de objetos del juego.

> **Notas:**
> - Solo se pueden buscar objetos obtenibles actualmente en el juego.
> - URL de imagen del objeto: `https://img-api.dfoneople.com/df/items/:itemId`

| Variable | Subvariable | Tipo | Descripción | Obligatorio | Default | Máx |
|----------|-------------|------|-------------|:-----------:|:-------:|:---:|
| limit | - | Integer | Número de filas a retornar | - | 10 | 30 |
| itemName | - | String | Nombre del objeto (URL encoding). `itemName` o `hashtag` requerido | Y | - | - |
| hashtag | - | String | Hashtag (URL encoding). Valores separados por comas (`,`) | Y | - | - |
| wordType | - | String | Tipo de búsqueda: `match`, `front`, `full` | - | match | - |
| q | - | - | - | - | - | - |
| | minLevel | Integer | Nivel mínimo de equipo | | | |
| | maxLevel | Integer | Nivel máximo de equipo | | | |
| | rarity | String | Raridad del objeto (URL encoding) | | | |

---

## 16. Item Information

`GET https://api.dfoneople.com/df/items/:itemId`

Información de un objeto.

> **Notas:**
> - Stats de equipo basados en valores de grado **Superior 100%**.
> - Los títulos, como excepción, se basan en valores de grado **Ordinary promedio**.
> - URL de imagen del objeto: `https://img-api.dfoneople.com/df/items/:itemId`
> - Sobre `talismanInfo.buff`: la columna buff muestra info de opciones de buff basadas en el estado de adquisición de la skill "Holy Ghost Mace" del Crusader (M); incluida en `explain`/`explainDetail` para Crusader (F) y Enchantress.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| itemId | String | Código único del objeto | Y |

---

## 17. Item Shop Sell Information

`GET https://api.dfoneople.com/df/items/:itemId/shop`

Información de venta en tienda del objeto.

> **Nota:** Se pueden buscar objetos vendidos en tiendas según la DFOpedia: Epic Lv. 95 y Unique/Legendary/Epic Lv. 100 o superior.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| itemId | String | Código único del objeto | Y |

---

## 18. Search Multiple Item Information

`GET https://api.dfoneople.com/df/multi/items`

Información de múltiples objetos.

> **Notas:**
> - Hasta 15 objetos por búsqueda.
> - IDs de objeto duplicados devuelven solo 1 resultado.
> - Ej.: `https://api.dfoneople.com/df/multi/items?itemIds=93a1d27e36e3071154abfc063977a844,3efb6b1f6079c569c67b5dc7f13a2085`

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| itemIds | String | Código único de objeto. Valores separados por comas (`,`) | Y |

---

## 19. Item Hashtag

`GET https://api.dfoneople.com/df/item-hashtag`

Hashtags de objetos.

| Variable | Tipo | Descripción | Obligatorio | Default | Máx |
|----------|------|-------------|:-----------:|:-------:|:---:|
| - | - | Sin parámetros | - | - | - |

---

## 20. Search Set Items

`GET https://api.dfoneople.com/df/setitems`

Búsqueda de objetos de set.

| Variable | Tipo | Descripción | Obligatorio | Default | Máx |
|----------|------|-------------|:-----------:|:-------:|:---:|
| setItemName | String | Nombre del set (URL encoding) | Y | - | - |
| limit | Integer | Número de filas a retornar | - | 10 | 100 |
| wordType | String | Tipo de búsqueda: `match`, `front`, `full` | - | - | - |

---

## 21. Set Item Information

`GET https://api.dfoneople.com/df/setitems/:setItemId`

Información de un objeto de set.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| setItemId | String | Código único del objeto de set | Y |

---

## 22. Class Information

`GET https://api.dfoneople.com/df/jobs`

Información de clases del juego.

| Variable | Tipo | Descripción | Obligatorio | Default | Máx |
|----------|------|-------------|:-----------:|:-------:|:---:|
| - | - | Sin parámetros | - | - | - |

---

## 23. Skill List Per Class

`GET https://api.dfoneople.com/df/skills/:jobId`

Lista de habilidades por clase.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| jobId | String | Código único de clase | Y |
| jobGrowId | String | Código único de clase de awakening | Y |

---

## 24. Skill Information Per Class

`GET https://api.dfoneople.com/df/skills/:jobId/:skillId`

Información de una habilidad por clase.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| jobId | String | Código único de clase | Y |
| skillId | String | Código único de habilidad | Y |

---

## 25. Multiple Skill Information

`GET https://api.dfoneople.com/df/multi/skills/:jobId`

Información de múltiples habilidades por clase.

> **Notas:**
> - Hasta 10 habilidades por búsqueda.
> - Los IDs de habilidad duplicados se eliminan.

| Variable | Tipo | Descripción | Obligatorio |
|----------|------|-------------|:-----------:|
| jobId | String | Código único de clase | Y |
| skillIds | String | Código único de habilidad. Valores separados por comas (`,`) | Y |