CREATE TABLE `acoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text,
	`responsavelSecretariaId` int NOT NULL,
	`dataInicio` date NOT NULL,
	`dataPrevista` date NOT NULL,
	`dataConclusao` date,
	`status` enum('planejada','em_progresso','concluida','atrasada','cancelada') NOT NULL DEFAULT 'planejada',
	`percentualConclusao` int NOT NULL DEFAULT 0,
	`prioridade` enum('baixa','media','alta','critica') NOT NULL DEFAULT 'media',
	`objetivoDecreto` varchar(100),
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `acoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `capacitacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text,
	`data` date NOT NULL,
	`local` text,
	`modalidade` enum('presencial','virtual','hibrida') NOT NULL,
	`instrutor` text,
	`cargaHoraria` int,
	`participantesEsperados` int NOT NULL DEFAULT 0,
	`participantesConfirmados` int NOT NULL DEFAULT 0,
	`participantesPresentes` int NOT NULL DEFAULT 0,
	`taxaPresenca` decimal(5,2) NOT NULL DEFAULT '0.00',
	`status` enum('agendada','realizada','cancelada') NOT NULL DEFAULT 'agendada',
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `capacitacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conformidade_regulatoria` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoria` enum('biblioteca_bim','cde','laboratorio_geobim','normativas','capacitacao','parcerias') NOT NULL,
	`item` text NOT NULL,
	`descricao` text,
	`percentualConclusao` int NOT NULL DEFAULT 0,
	`status` enum('nao_iniciado','em_progresso','concluido') NOT NULL DEFAULT 'nao_iniciado',
	`responsavelSecretariaId` int,
	`dataInicio` date,
	`dataPrevista` date,
	`dataConclusao` date,
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conformidade_regulatoria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `participantes_capacitacao` (
	`id` int AUTO_INCREMENT NOT NULL,
	`capacitacaoId` int NOT NULL,
	`secretariaId` int NOT NULL,
	`numeroParticipantes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `participantes_capacitacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `presencas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reuniaoId` int NOT NULL,
	`secretariaId` int NOT NULL,
	`presente` boolean NOT NULL DEFAULT false,
	`tipoParticipante` enum('titular','suplente') NOT NULL,
	`justificativa` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `presencas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reunioes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` int NOT NULL,
	`data` date NOT NULL,
	`tipo` enum('ordinaria','extraordinaria') NOT NULL,
	`local` text,
	`modalidade` enum('presencial','virtual','hibrida') NOT NULL,
	`pauta` text,
	`ata` text,
	`quorumAtingido` boolean NOT NULL DEFAULT false,
	`totalPresentes` int NOT NULL DEFAULT 0,
	`totalEsperado` int NOT NULL DEFAULT 11,
	`taxaPresenca` decimal(5,2) NOT NULL DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reunioes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `secretarias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sigla` varchar(20) NOT NULL,
	`nome` text NOT NULL,
	`titularNome` text,
	`titularEmail` varchar(320),
	`titularTelefone` varchar(20),
	`suplenteNome` text,
	`suplenteEmail` varchar(320),
	`suplenteTelefone` varchar(20),
	`ordem` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `secretarias_id` PRIMARY KEY(`id`),
	CONSTRAINT `secretarias_sigla_unique` UNIQUE(`sigla`)
);
