# Anúncios e remarketing — Meta, LinkedIn e Google Ads

O site mede visitas e conversões para as plataformas de anúncio **só depois que a
pessoa aceita os cookies de marketing** no banner (o GA4, com os de análise).
Cada plataforma liga quando o ID dela está no `.env.local` e o site é gerado de
novo (`pnpm release`). Sem o ID, nada carrega.

Código: `lib/tracking/` (IDs, eventos e plataformas), `components/tracking/trackers.tsx`
(carrega conforme o banner) e `lib/forms/submit.ts` (conversão de cada formulário).

## O que é medido

| Ação no site | Meta | LinkedIn | Google Ads | GA4 |
|---|---|---|---|---|
| Página vista (inclusive navegação interna) | PageView | página vista | page_view | page_view (automático) |
| Abrir artigo ou material | ViewContent | — | — | — |
| Formulário da home, contato, franquia ou material | Lead | conversão "Lead" | conversão "Lead" | generate_lead |
| Formulário de LP do modelo "Inscrição em evento" | CompleteRegistration | conversão "Inscrição" | conversão "Inscrição" | generate_lead |
| Formulário das demais LPs | Lead (nome = endereço da LP) | conversão "Lead" | conversão "Lead" | generate_lead |
| Trabalhe conosco | SubmitApplication | — | — | submit_application |
| Clique em qualquer link do WhatsApp | Contact | conversão "Contato" | conversão "Contato" | whatsapp_click |

Nenhum dado do formulário vai para os pixels. Na Meta, a **Conversions API**
(opcional, abaixo) manda e-mail, telefone e nome **criptografados** pelo Apps
Script, com o mesmo id de evento do Pixel: a Meta conta o lead uma vez só.

## 1. Meta (Facebook e Instagram)

1. **Pixel:** business.facebook.com → Gerenciador de Eventos → Conectar fontes de
   dados → Web → nome "Vispe Capital – site" → copie o **ID do conjunto de dados (Pixel)**.
   Em "Configurar", escolha instalar o código manualmente e **pule** o código (o site já tem).
2. `.env.local`: `NEXT_PUBLIC_META_PIXEL_ID=<ID>`.
3. **Verificar o domínio** (Configurações do negócio → Segurança da marca → Domínios →
   Adicionar `vispecapital.com`):
   - pelo **DNS** (recomendado): copie o registro TXT e crie na Hostinger (hPanel →
     Domínios → DNS / Nameservers → Adicionar registro TXT, nome `@`);
   - ou pela **meta tag**: copie só o valor de `content="…"` para
     `NEXT_PUBLIC_META_DOMAIN_VERIFICATION`.
4. **Conversions API (opcional, recomendado):** Gerenciador de Eventos → o Pixel →
   Configurações → API de Conversões → "Gerar token de acesso". No Apps Script da
   planilha → Configurações do projeto → Propriedades do script:
   - `META_PIXEL_ID` = o mesmo ID;
   - `META_CAPI_TOKEN` = o token;
   - para testar: `META_TEST_EVENT_CODE` = o código da aba "Testar eventos" (apague depois).

   Cole o `integrations/google-sheets/Code.gs` atual e publique uma **Nova versão**
   (Implantar → Gerenciar implantações → editar → Nova versão).
5. **Eventos agregados:** no Gerenciador de Eventos, priorize Lead, CompleteRegistration
   e Contact (para quem usa iPhone).

> **Categoria especial de anúncio:** anúncios de crédito/produtos financeiros caem na
> categoria especial da Meta, com segmentação limitada. Consultoria e diagnóstico
> normalmente não; ofertas de captação ou crédito podem cair. Confira antes de subir.

## 2. LinkedIn

1. linkedin.com/campaignmanager → conta de anúncios → **Analisar → Insight Tag** →
   "Instalar minha Insight Tag" → "Vou instalar a tag eu mesmo" → copie o **Partner ID**
   (só os números). `.env.local`: `NEXT_PUBLIC_LINKEDIN_PARTNER_ID=<ID>`.
2. **Conversões:** Analisar → Rastreamento de conversões → Criar conversão → tipo
   **"Evento específico"** (não por URL), uma para cada:
   - Lead → `NEXT_PUBLIC_LINKEDIN_CONVERSION_LEAD`
   - Inscrição em evento → `NEXT_PUBLIC_LINKEDIN_CONVERSION_REGISTRATION`
   - Contato (WhatsApp) → `NEXT_PUBLIC_LINKEDIN_CONVERSION_CONTACT`

   O ID de cada uma aparece no código de exemplo (`conversion_id: 1234567`).
3. **Públicos:** Plano → Públicos → Criar público → Site, por URL (ex.: quem visitou
   `/lp/workshop`, `/materiais`, ou todo o site). O LinkedIn precisa de 300 pessoas para
   veicular.

## 3. Google Ads (pronto, desligado)

Quando for usar:

1. Google Ads → Metas → Conversões → Nova ação de conversão → Site → manual
   ("Usar o Google Tag Manager" **não**; escolha "Instalar a tag você mesmo").
2. O ID `AW-…` vai em `NEXT_PUBLIC_GOOGLE_ADS_ID`. De cada conversão (Lead,
   Inscrição, Contato), copie o rótulo, o trecho depois da barra em `send_to: 'AW-…/rótulo'`,
   para `NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD` / `_REGISTRATION` / `_CONTACT`.
3. Remarketing: Ferramentas → Gerenciador de públicos → Segmentos → Visitantes do site.
4. GA4 (opcional): `NEXT_PUBLIC_GA4_ID=G-…` e vincular a propriedade ao Google Ads.

O Consent Mode v2 já está ligado ao banner (modo básico: nada carrega sem consentimento).

## Depois de preencher

1. `pnpm release` e suba o pacote.
2. No site publicado, aceite os cookies e confira:
   - Meta: extensão **Meta Pixel Helper** e "Testar eventos" no Gerenciador;
   - LinkedIn: **Insight Tag Helper**; o status da tag fica "Ativa" em até 24 h;
   - envie um formulário de teste e veja o Lead nas duas.
3. Rejeitando os cookies, nenhuma das plataformas pode aparecer na aba Rede do navegador.

Mudou de ferramenta? Atualize a lista de fornecedores na Política de Privacidade
(`content/*/privacy.ts`).
