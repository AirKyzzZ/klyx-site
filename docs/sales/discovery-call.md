# Appel découverte (30 min)

Pour : fondateurs de startups, gérants et directeurs techniques d'agences.
But de l'appel : savoir si je peux les aider, et si oui repartir avec une prochaine étape datée (Audit IA ou Sprint IA). Si ce n'est pas un bon fit, je le dis pendant l'appel.

Avant l'appel, 5 minutes : site de la boîte, LinkedIn de la personne, dernière levée ou dernier recrutement tech, offre d'emploi « AI engineer » ouverte s'il y en a une. Je note une hypothèse sur leur besoin, pour la confronter, pas pour la réciter.

## Déroulé

| Temps | Étape | Ce que je cherche |
|---|---|---|
| 0-3 min | Cadre | L'accord sur l'ordre du jour et la durée |
| 3-15 min | Leur situation | Le problème, ce qu'il coûte, ce qu'ils ont déjà essayé |
| 15-20 min | Qualification | Budget, timing, décideur, stack |
| 20-25 min | Proposition | Une offre, un prix, une durée |
| 25-30 min | Prochaine étape | Une date dans l'agenda, pas « on se rappelle » |

## 1. Cadre (0-3 min)

> « Merci de prendre le temps. Je propose 30 minutes : vous me racontez où vous en êtes, je vous pose quelques questions, et à la fin je vous dis honnêtement si je peux vous aider et à quel prix. Si ce n'est pas le cas, je vous le dis aussi. Ça vous va ? »

Je ne présente pas Klyx en long ici. S'ils demandent, une phrase :

> « Je suis Maxime, je suis développeur fullstack à Bordeaux. Je livre des sites et des agents IA au forfait pour des startups et des agences, avec le code dans votre repo. »

## 2. Leur situation (3-15 min)

Je pose une question, je me tais, je relance sur ce qu'ils disent. Je ne prends pas toutes les questions, je prends celles qui font avancer.

Ouverture :
- « Qu'est-ce qui vous a fait prendre cet appel cette semaine, et pas il y a trois mois ? »
- « Si on se reparle dans 3 mois et que c'est réglé, qu'est-ce qui a changé ? »

Startup :
- « Quelle fonctionnalité IA vous devez livrer, et pour quand ? »
- « Qui la construit aujourd'hui ? Combien de personnes côté tech ? »
- « Vous avez déjà un prototype ? Qu'est-ce qui bloque entre le prototype et la prod ? »
- « Est-ce qu'un client ou un prospect vous la réclame ? Lequel, et qu'est-ce qu'il demande précisément ? »
- « Vous avez essayé de recruter ? Depuis combien de temps le poste est ouvert ? »

Agence :
- « Qu'est-ce que vos clients vous demandent en IA que vous ne savez pas livrer aujourd'hui ? »
- « Il y a un brief précis sur la table, ou c'est une tendance que vous voyez venir ? »
- « Quand vous sous-traitez, qu'est-ce qui s'est mal passé avant ? »
- « Ça doit sortir sous votre marque ? Le client final sait qu'il y a un prestataire ? »

Coût du problème :
- « Qu'est-ce que ça vous coûte si rien ne bouge d'ici 2 mois ? Un client, un deal, des heures ? »
- « Combien de temps votre équipe passe là-dessus chaque semaine ? »

## 3. Qualification (15-20 min)

Les quatre points à avoir avant de proposer quoi que ce soit. Si l'un manque, je le note et je le traite en prochaine étape.

Budget :
- « Pour vous situer : un Audit IA démarre à 1 500 € HT, un Sprint IA à 4 500 € HT pour un workflow en production en 2 semaines. Est-ce que c'est dans l'enveloppe que vous aviez en tête ? »
- Je donne le prix tôt. Les prix sont publics de toute façon, et ça évite 20 minutes perdues des deux côtés.

Timing :
- « Pour quand il faut que ce soit en production ? Qu'est-ce qui fixe cette date ? »
- « Si on démarrait, ce serait quand au plus tôt de votre côté ? »

Décideur :
- « À part vous, qui doit dire oui ? »
- « Comment ça se passe d'habitude chez vous pour valider un prestataire ? Devis, bon de commande, juridique ? »

Stack actuelle :
- « Sur quoi tourne le produit aujourd'hui ? Langage, framework, hébergement ? »
- « Vous utilisez déjà un modèle (OpenAI, Anthropic, Mistral, autre) ? Avec quelles données ? »
- « Où sont les données dont l'agent aurait besoin : CRM, base, Notion, Drive ? Qui y a accès ? »
- « Des contraintes RGPD, hébergement en Europe, données clients sensibles ? »

Je coupe court poliment si : pas de budget même pour l'audit, aucun décideur joignable, ou le besoin est hors de ce que je fais bien. Je propose alors une ressource ou un contact, sans forcer.

## 4. Proposition (20-25 min)

Je reformule d'abord, en une ou deux phrases, avec leurs mots :

> « Si je résume : vous devez livrer [X] avant [date], l'équipe n'a pas le temps ou pas l'expérience pour le passer en prod, et chaque semaine de retard vous coûte [Y]. C'est ça ? »

Puis une seule recommandation, pas un catalogue.

| Leur situation | Je propose | Prix (€ HT, à partir de) |
|---|---|---|
| Le besoin est flou, plusieurs pistes, pas de priorité claire | Audit IA + roadmap, 1-2 semaines | 1 500 |
| Un workflow précis, données accessibles, une date | Sprint IA, un workflow en production, 2 semaines, périmètre fixe | 4 500 |
| Besoin continu, backlog IA, équipe en place qui veut quelqu'un dedans | Forward Deployed Engineer à temps partagé, 2-3 jours par semaine, 4 semaines minimum | 700 / jour (soit ~5 600 sur 4 semaines) |
| Agence avec un brief site sous sa marque | Landing 900, Site IA 2 900, sur mesure 5 700 | voir ligne |

Phrases pour l'audit :

> « Je vous propose de commencer par l'audit. En 1 à 2 semaines je regarde vos process, je classe les automatisations par heures gagnées et par risque, et je vous laisse une roadmap. Si vous enchaînez sur un Sprint, le prix de l'audit est déduit. TODO(maxime): conditions exactes du crédit (piste : 100 % déduit si le Sprint est signé sous 60 jours). »

Phrases pour le sprint :

> « Là, le besoin est assez clair pour attaquer directement. Le Sprint IA, c'est un workflow en production en 2 semaines, périmètre écrit avant de commencer, 4 500 € HT. Le code est dans votre repo dès le premier jour. »

Pour le FDE, je rappelle la limite :

> « Je ne prends que 2 clients à la fois en temps partagé. Ça se fait sur 4 semaines minimum, 2 à 3 jours par semaine, à partir de 700 € HT la journée. »

## 5. Objections

Je réponds court, avec quelque chose qu'ils peuvent vérifier. Je ne promets rien que je ne peux pas tenir pendant l'appel.

**« Tu as 20 ans, on cherche quelqu'un de plus expérimenté. »**
> « C'est normal de se poser la question. Plutôt que de me croire sur parole, regardez ce que j'ai livré : mon GitHub est public (TODO(maxime): lien du profil et 2-3 PR ou repos à montrer). Le code est dans votre repo dès le premier jour, donc vous voyez tout ce que je fais au fil de l'eau. Et si vous voulez un premier pas à faible risque, l'audit coûte 1 500 € HT et il est déduit du sprint si vous continuez. »

**« Tu es seul. Si tu disparais, on est exposés (ou : notre client est exposé). »**
> « Oui, je suis seul, et je préfère le dire tout de suite. Ce qui vous protège : le code est dans votre repo, pas chez moi, la doc de passation est écrite pour qu'un autre dev reprenne sans moi, et le périmètre est écrit avant de commencer. Je n'ai pas d'astreinte 24/7 et je ne prends que 2 clients en temps partagé, justement pour tenir les délais. »

Pour une agence, j'ajoute :
> « Je peux travailler sous votre marque, avec une clause de confidentialité. TODO(maxime): modèle de NDA / clause marque blanche prêt à envoyer. »

**« C'est trop cher. »**
> « Par rapport à quoi ? Si c'est par rapport à un recrutement, comparez à plusieurs mois de salaire chargé et au temps de recrutement. Si c'est le montant tout de suite, l'audit à 1 500 € HT est le plus petit pas, et il est déduit du sprint. Le devis est gratuit, donc je peux vous chiffrer le périmètre exact avant que vous décidiez. »

**« On va le faire en interne. »**
> « Ça peut être le bon choix. La question c'est qui, et quand. Si l'équipe a le temps dans les 2 semaines, faites-le. Sinon, je peux livrer le premier workflow et laisser la doc pour que votre équipe prenne la suite. »

**« On doit réfléchir. »**
> « Bien sûr. Qu'est-ce qui vous manque pour décider : le prix, le périmètre, l'avis de quelqu'un d'autre ? Je vous envoie un devis gratuit d'ici [jour], et on cale 15 minutes [date] pour en parler. »

**« Vous avez des références ? »**
> TODO(maxime): liste des clients qui acceptent d'être cités et d'être appelés (David A., Antoni V., Clément D. ?). Ne rien citer avant leur accord. En attendant : « Je vous envoie les projets livrés avec ce qui a été construit sur chacun, et mon GitHub. »

**« Et la sécurité, le RGPD ? »**
> « Je travaille avec vos accès et dans votre infra quand c'est possible. On liste ensemble les données qui passent par le modèle avant de commencer, et je le documente. » TODO(maxime): préciser les engagements réels (hébergement UE, fournisseurs de modèles utilisés, DPA).

Ce que je ne dis jamais : un niveau d'expérience que je n'ai pas, une traduction maison de « Forward Deployed Engineer », un nombre de projets ou d'heures gagnées que je ne peux pas sourcer, une garantie de livraison (pas à ce stade).

## 6. Clôture (25-30 min)

Je propose une étape concrète, avec une date :

> « Je vous propose ceci : je vous envoie le devis pour [Audit / Sprint] d'ici [jour], et on se cale 15 minutes [date] pour le valider ou l'ajuster. Je bloque le créneau maintenant ? »

Si c'est un oui pendant l'appel :

> « Parfait. Je vous envoie le devis aujourd'hui, avec le périmètre écrit. Dès qu'il est signé, on fixe le démarrage. Pour gagner du temps, vous pouvez déjà me donner accès à [repo / données]. »

Si c'est un non clair :

> « Merci de me l'avoir dit franchement. Je peux vous recontacter dans [délai], ou vous préférez que je ne relance pas ? »

## Après l'appel (même jour)

- Mail de récap : leur problème avec leurs mots, l'offre proposée, le prix, la date du prochain échange.
- Devis envoyé dans le délai annoncé.
- Notes : budget, timing, décideur, stack, objections entendues, prochaine étape.
