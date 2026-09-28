# Fontes e licenças (CLAUDE.md, seção 1A.1)

Registro dos termos de uso lidos **antes** do primeiro download de cada site.

| Fonte | Termos de uso | Licença | robots.txt | Download automatizado | Conclusão |
|---|---|---|---|---|---|
| Radiopaedia (radiopaedia.org) | **não lido** | CC BY-NC-SA 3.0 (declarado no CLAUDE.md; conferir na página de licença) | **não lido** | a verificar | **Bloqueado**: em 2026-09-28 a política de rede da sessão de nuvem recusou radiopaedia.org (proxy 403). Nada foi baixado |
| Radiology Education | — | — | — | — | Endereço exato a confirmar com o usuário (seção 1A) |
| Teaching Files Radiology | — | — | — | — | Endereço exato a confirmar com o usuário (seção 1A) |

## Para destravar o Radiopaedia

Liberar `radiopaedia.org` e os subdomínios de imagem (`*.radiopaedia.org`) nas configurações de rede do ambiente (menu do ambiente de nuvem → Edit → Network access). Depois disso, o Claude lê primeiro os termos, a licença e o `robots.txt` e registra a conclusão nesta tabela. Se os termos proibirem download automatizado, ele gera `downloads-manuais.md` com as URLs exatas.
