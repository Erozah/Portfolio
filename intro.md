# HTML - CSS

## Histoire

Créé en **1989** au **CERN** -> partage de document scientifique

## Analogie

HTML != language back

HTML === squelette / ossature -> structure l'information
CSS === Habillage / style -> mise en page

## Focus -> HTML

- language de balise
- Doctype -> préciser le language
- Entête / body
- Sementique -> expliquer ce qu'il y a à l'intérieur (nav / footer / section / header / aside)
- Hiérarchie de projet
- Hiérarchie de structure -> poupée russe -> imbrication -> indentation (mise en page / facilité de lecture)
- Hypertext -> lien entre les éléments
- Html -> style par défault / comportement par défault

### HTML -> structure

 ```html
	<html>
	<head>
		-> Invisible pour l'utilisateur
		-> Paramétrer
		-> Référencer
		-> Importer
	</head>
	<body>
		-> Visible pour l'utilisateur
		-> Tous les éléments visibles sont ici
		-> DOM
	</body>
	</html>
  ```

  ## Focus -> CSS
  - Couche de peinture
  - CSS -> Cascading stylesheet -> Feuille de style
  - Style inline / <style></style> / fichier lié -> dans le head <link />
  - Priorité sur l'import de la feuille de style
  - `!important` "casse" le projet