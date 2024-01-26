Ce programme implémente un serveur de multiplication de matrices simples qui écoute les connexions entrantes sur le port 8084. 
Lorsqu'un client se connecte, le serveur reçoit deux matrices du client, les multiplie en parallèle à l'aide de goroutines, puis renvoie le résultat au client.
On a aussi implémenté le code sans les go routines et ajouter un timer pour comparer les performances en temps.
