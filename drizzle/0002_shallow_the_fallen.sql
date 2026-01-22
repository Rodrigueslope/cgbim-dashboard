CREATE TABLE `materiais_apoio` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reuniaoId` int NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text,
	`arquivoUrl` text NOT NULL,
	`arquivoNome` text NOT NULL,
	`tipoArquivo` varchar(50),
	`tamanho` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materiais_apoio_id` PRIMARY KEY(`id`)
);
