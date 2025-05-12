# Park1t&Go

## Feladatspecifikáció
- A célunk az volt, hogy egy könnyen használható parkolási platformot hozzunk létre. Ez nemcsak egy új lehetőséget ad, hanem leegyszerűsíti a parkolóházak kezelését és a parkolást.
- A Park1t&Go többféle felhasználói szinttel rendelkezik: parkolóház-üzemeltetők, adminisztrátorok és parkolókat használó emberek. A cél az, hogy könnyebben lehessen foglalni és kezelni a parkolóhelyeket, valamint egyszerűbbé teszi az ügyfelek és üzemeltetők együttműködését. 
- Ez a rendszer nem csupán egy újabb alkalmazás, hanem segít az adminisztrációban, leegyszerűsíti a parkolást, és támogatja a környezetbarát megoldásokat, hozzájárulva a városi közlekedés jobb működéséhez.

## A projekt backend-je:
Az androidos és webes felület felhasználói célra készült:
- Tartalmazza:
  - az alapvető felhasználókezelési funkciókat (bejelentkezés, regisztráció, profil megtekintése/módosítása)
  - személygépjármű adatainak szerkesztése
  - parkolóházak és azok helyeinek böngészését
  - időpontfoglalást

Az asztali alkalmazás rendszergazdai használatra készült:
- Tartalmazza:
  - felhasználók felülvizsgálata, létrehozása és törlése valamint azok adatainak szerkesztése
  - parkolóházak felülvizsgálata, létrehozása és törlése valamint azok adatainak szerkesztése
  - foglalások felülvizsgálata, létrehozása és törlése valamint azok adatainak szerkesztése

A backend futtatásához szükséges források:
- Node
- Git
- NuGet csomagok:
  - Express
  - Sequelize
  - JsonWebToken
  - Cors
  - MySQL2
  - dotenv:
    - A backend futtatásához a '.env' fájlt, a fejlesztőnek kell létrehoznia manuálisan és a következő adatokat kell tartalmaznia:
      - SECRETKEY
      - PASSWORD
      - USERNAME
      - HOST
      - PORT

- Mappa létrehozása a projektnek
- A mappa megnyitása terminálban
- Git inicializálása

```sh
git init
```

- Git repo klónozása

```sh
git clone https://github.com/VidekiCorleone/FinalProject.git
```

- Elindítani a XAMPP Apache és MySQL szerverét
- PHP MyAdmin segítségével létrehozni egy parkhouse nevű utf8mb4_hungarian_ci kódolású adatbázist
- Ezután a projekt mappájának megnyitása parancssorban
- Csomagok telepítése

```sh
npm install
```

- Szerver elindítása

```sh
node server.js
```

## Minimum rendszerkövetelmények:
- Android ™ 13.0 (Tiramisu), vagy újabb
- FireFox 136.0.4, vagy újabb
- Visual Studio 2022 v17.13, vagy újabb

## Telepítés
- Fejlesztőknek a projekt klónozását követően az alkalmazás indításához az Android Studio programcsomag használata javasolt.
- Asztali alkalmazás fejlesztőknek, a Visual Studio 2022-es verziója javasolt.
- Webfejlesztőknek a Visual Studio Code használata javasolt.

## Dokumentáció
- [Dokumentáció](https://github.com/VidekiCorleone/FinalProject/blob/main/Dokument%C3%A1ci%C5%91.docx)