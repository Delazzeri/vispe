-- Mensagem do botão de WhatsApp de cada landing page
-- ("Olá, gostaria de mais informações sobre o workshop."). Vazia: a mensagem
-- padrão do site. A versão em inglês fica em landing_pages.en->>'whatsappMessage'.
--
-- Projeto que já tem o banco (0001–0010): SQL Editor → cole este arquivo → Run.

alter table public.landing_pages add column if not exists whatsapp_message text;
