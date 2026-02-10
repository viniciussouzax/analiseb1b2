# Instruções para Fontes Locais

Copie as fontes de `themes/kingkong/assets/fonts/` para esta pasta `assets/fonts/` mantendo a estrutura:

```
assets/fonts/
├── FuturaLT-CondensedExtraBold/
│   ├── FuturaLT-CondensedExtraBold.woff2
│   ├── FuturaLT-CondensedExtraBold.woff
│   └── FuturaLT-CondensedExtraBold.ttf
├── InterBlack/
│   ├── Inter-Black.woff2
│   ├── Inter-Black.woff
│   └── Inter-Black.ttf
├── InterBold/
│   ├── Inter-Bold.woff2
│   ├── Inter-Bold.woff
│   └── Inter-Bold.ttf
├── InterLight/
│   ├── Inter-Light.woff2
│   ├── Inter-Light.woff
│   └── Inter-Light.ttf
├── InterMedium/
│   ├── Inter-Medium.woff2
│   ├── Inter-Medium.woff
│   └── Inter-Medium.ttf
└── InterRegular/
    ├── Inter-Regular.woff2
    ├── Inter-Regular.woff
    └── Inter-Regular.ttf
```

## Formato dos arquivos

Os arquivos podem ter as extensões:
- `.woff2` (preferencial - mais otimizado)
- `.woff` (fallback)
- `.ttf` (fallback final)

O CSS está configurado para tentar carregar em ordem de otimização.
