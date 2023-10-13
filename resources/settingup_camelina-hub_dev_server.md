#  Setting up untwsit dev server

### the installed docker version does not work without sudo 

```
ata@untwist-dev:~$ docker ps
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/json": dial unix /var/run/docker.sock: connect: permission denied


ata@untwist-dev:~$ sudo docker ps 
CONTAINER ID   IMAGE                               COMMAND                  CREATED         STATUS        PORTS      NAMES
1bf7fe9ba3d9   untwist-db_untwist_app_server       "docker-entrypoint.s…"   13 months ago   Up 7 months   8080/tcp   untwist-spa
7e608a28844a   untwist-db_untwist_graphql_server   "docker-entrypoint.s…"   13 months ago   Up 7 months   3000/tcp   untwist-graphql_server
1c5675e7b5ef   untwist-db_untwist_postgres         "docker-entrypoint.s…"   13 months ago   Up 7 months   5432/tcp   untwist-postgres
909573b6b573   darthsim/imgproxy                   "imgproxy"               13 months ago   Up 7 months   8080/tcp   untwist-imgproxy
```

### what is/was running 

```
ata@untwist-dev:~$ sudo docker ps -a
CONTAINER ID   IMAGE                               COMMAND                  CREATED         STATUS                       PORTS                               NAMES
7571fe050a8a   untwist-db_untwist_graphiql         "docker-entrypoint.s…"   13 months ago   Exited (1) 13 months ago                                         untwist-graphiql-auth
1bf7fe9ba3d9   untwist-db_untwist_app_server       "docker-entrypoint.s…"   13 months ago   Up 7 months                  8080/tcp                            untwist-spa
fa5739050167   quay.io/keycloak/keycloak:15.0.2    "/opt/jboss/tools/do…"   13 months ago   Exited (255) 7 months ago    8080/tcp, 8443/tcp                  untwist-keycloak
7e608a28844a   untwist-db_untwist_graphql_server   "docker-entrypoint.s…"   13 months ago   Up 7 months                  3000/tcp                            untwist-graphql_server
dd857dbc8efb   postgres                            "docker-entrypoint.s…"   13 months ago   Exited (255) 7 months ago    5432/tcp                            untwist-pgdb_keycloak
40929431b7aa   traefik:latest                      "/entrypoint.sh --pr…"   13 months ago   Exited (255) 7 months ago    0.0.0.0:80->80/tcp, :::80->80/tcp   untwist-db_reverse_proxy_1
1c5675e7b5ef   untwist-db_untwist_postgres         "docker-entrypoint.s…"   13 months ago   Up 7 months                  5432/tcp                            untwist-postgres
909573b6b573   darthsim/imgproxy                   "imgproxy"               13 months ago   Up 7 months                  8080/tcp                            untwist-imgproxy
885fe27b87dc   minio/minio                         "/usr/bin/docker-ent…"   13 months ago   Exited (255) 7 months ago    9000/tcp                            minio
f5d66d2ccef0   development_zendro_graphiql         "docker-entrypoint.s…"   16 months ago   Exited (137) 15 months ago                                       zendroStarterPack_graphiql-auth
d6801380becd   development_zendro_spa              "docker-entrypoint.s…"   16 months ago   Exited (137) 15 months ago                                       zendroStarterPack_spa
d289f3ab26c2   development_zendro_graphql_server   "docker-entrypoint.s…"   16 months ago   Exited (137) 15 months ago                                       zendroStarterPack_graphql-server
378a5eecee12   quay.io/keycloak/keycloak:15.0.2    "/opt/jboss/tools/do…"   16 months ago   Exited (0) 15 months ago                                         zendro_keycloak
129764fe3a77   postgres                            "docker-entrypoint.s…"   16 months ago   Exited (0) 15 months ago                                         pgdb_keycloak
```

### all container ids

```
ata@untwist-dev:~$ echo $(sudo docker ps -aq)
7571fe050a8a 1bf7fe9ba3d9 fa5739050167 7e608a28844a dd857dbc8efb 40929431b7aa 1c5675e7b5ef 909573b6b573 885fe27b87dc f5d66d2ccef0 d6801380becd d289f3ab26c2 378a5eecee12 129764fe3a77
```

### Stopping them all even with sudo did not work
```
ata@untwist-dev:~$ sudo docker stop $(sudo docker ps -aq)
7571fe050a8a
1bf7fe9ba3d9
fa5739050167
7e608a28844a
dd857dbc8efb
40929431b7aa
1c5675e7b5ef
909573b6b573
885fe27b87dc
f5d66d2ccef0
d6801380becd
d289f3ab26c2
378a5eecee12
129764fe3a77

ata@untwist-dev:~$ sudo docker ps
CONTAINER ID   IMAGE                               COMMAND                  CREATED         STATUS        PORTS      NAMES
1bf7fe9ba3d9   untwist-db_untwist_app_server       "docker-entrypoint.s…"   13 months ago   Up 7 months   8080/tcp   untwist-spa
7e608a28844a   untwist-db_untwist_graphql_server   "docker-entrypoint.s…"   13 months ago   Up 7 months   3000/tcp   untwist-graphql_server
1c5675e7b5ef   untwist-db_untwist_postgres         "docker-entrypoint.s…"   13 months ago   Up 7 months   5432/tcp   untwist-postgres
909573b6b573   darthsim/imgproxy                   "imgproxy"               13 months ago   Up 7 months   8080/tcp   untwist-imgproxy

ata@untwist-dev:~$ sudo docker stop 909573b6b573
909573b6b573
ata@untwist-dev:~$ sudo docker ps
CONTAINER ID   IMAGE                               COMMAND                  CREATED         STATUS        PORTS      NAMES
1bf7fe9ba3d9   untwist-db_untwist_app_server       "docker-entrypoint.s…"   13 months ago   Up 7 months   8080/tcp   untwist-spa
7e608a28844a   untwist-db_untwist_graphql_server   "docker-entrypoint.s…"   13 months ago   Up 7 months   3000/tcp   untwist-graphql_server
1c5675e7b5ef   untwist-db_untwist_postgres         "docker-entrypoint.s…"   13 months ago   Up 7 months   5432/tcp   untwist-postgres
909573b6b573   darthsim/imgproxy                   "imgproxy"               13 months ago   Up 7 months   8080/tcp   untwist-imgproxy
```


## even switching to root user could not stop them
```
root@untwist-dev:/home/ata# docker stop $(sudo docker ps -aq)
7571fe050a8a
1bf7fe9ba3d9
fa5739050167
7e608a28844a
dd857dbc8efb
40929431b7aa
1c5675e7b5ef
909573b6b573
885fe27b87dc
f5d66d2ccef0
d6801380becd
d289f3ab26c2
378a5eecee12
129764fe3a77
root@untwist-dev:/home/ata# docker ps
CONTAINER ID   IMAGE                               COMMAND                  CREATED         STATUS        PORTS      NAMES
1bf7fe9ba3d9   untwist-db_untwist_app_server       "docker-entrypoint.s…"   13 months ago   Up 7 months   8080/tcp   untwist-spa
7e608a28844a   untwist-db_untwist_graphql_server   "docker-entrypoint.s…"   13 months ago   Up 7 months   3000/tcp   untwist-graphql_server
1c5675e7b5ef   untwist-db_untwist_postgres         "docker-entrypoint.s…"   13 months ago   Up 7 months   5432/tcp   untwist-postgres
909573b6b573   darthsim/imgproxy                   "imgproxy"               13 months ago   Up 7 months   8080/tcp   untwist-imgproxy
``` 

## Troubleshooting 
```
```

### Backup

```
ata@untwist-dev:~$ ls -ltrh  /var/projects/untwist-db
total 120K
drwxr-xr-x  3 asis asis 4.0K Jul  1  2022 contexts
drwxr-xr-x  4 asis asis 4.0K Jul  1  2022 config
-rw-r--r--  1 asis asis  13K Jul  1  2022 README.md
-rw-r--r--  1 asis asis  35K Jul  1  2022 LICENSE
-rw-r--r--  1 asis asis 3.2K Jul  1  2022 docker-compose-dev.yml
drwxr-xr-x  2 asis asis 4.0K Jul  1  2022 scripts
-rw-r--r--  1 asis asis   86 Jul  1  2022 yarn.lock
drwxr-xr-x  4 asis asis 4.0K Jul  1  2022 graphiql-auth
-rw-r--r--  1 asis asis 3.9K Jul  1  2022 docker-compose-prod.yml
-rw-r--r--  1 asis asis 4.2K Jul  1  2022 docker-compose-local.yml
-rw-r--r--  1 asis asis 5.7K Jul  1  2022 docker-compose-local-traefik.yml
drwxr-xr-x  2 asis asis 4.0K Jul  1  2022 data_model_definitions
drwxr-xr-x  3 asis asis 4.0K Jul  1  2022 data
drwxr-xr-x  3 asis asis 4.0K Jul  1  2022 backup
drwxr-xr-x 12 asis asis 4.0K Jul  1  2022 graphql-server
drwxr-xr-x  7 asis asis 4.0K Jul  1  2022 single-page-app
-rw-r--r--  1 asis asis  264 Jul  1  2022 package.json


ata@untwist-dev:~$ ls -ltrh /var/projects/untwist-db-env-files
ls: cannot access '/var/projects/untwist-db-env-files': No such file or directory


scp -r ata@172.17.0.47:/var/projects/untwist-db .
tar -czvf  untwist-db.tar.gz untwist-db

[ata@bangor ASIS_BACKUP]$ ls -ltrh
total 5,8M
drwxr-xr-x. 12 ata ata   21 13. Okt 09:59 untwist-db
-rw-rw-r--.  1 ata ata 5,8M 13. Okt 10:04 untwist-db.tar.gz

[ata@bangor ASIS_BACKUP]$ pwd
/mnt/data/ata/ASIS_BACKUP
```


## Cleaning 


There is no space to install anything 

```
ata@untwist-dev:~$ df -h
Filesystem      Size  Used Avail Use% Mounted on
udev             16G     0   16G   0% /dev
tmpfs           3.2G  355M  2.8G  12% /run
/dev/vda1        49G   49G     0 100% /
tmpfs            16G     0   16G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs            16G     0   16G   0% /sys/fs/cgroup
/dev/vda15      105M  5.2M  100M   5% /boot/efi
/dev/loop2       56M   56M     0 100% /snap/core18/2697
/dev/loop4       50M   50M     0 100% /snap/snapd/18357
/dev/loop5       92M   92M     0 100% /snap/lxd/23991
/dev/loop6       92M   92M     0 100% /snap/lxd/24061
/dev/loop3       64M   64M     0 100% /snap/core20/1828
/dev/vdb1        98G   24K   93G   1% /mnt/local
/dev/loop7       50M   50M     0 100% /snap/snapd/17950
/dev/loop8       56M   56M     0 100% /snap/core18/2721
/dev/loop9       64M   64M     0 100% /snap/core20/1879
tmpfs           3.2G     0  3.2G   0% /run/user/3003
tmpfs           3.2G     0  3.2G   0% /run/user/3014
```

```
ata@untwist-dev:~$ sudo apt autoremove
[sudo] password for ata: 
Reading package lists... Done
Building dependency tree       
Reading state information... Done
You might want to run 'apt --fix-broken install' to correct these.
The following packages have unmet dependencies:
 linux-image-virtual : Depends: linux-image-5.4.0-148-generic but it is not installed
E: Unmet dependencies. Try 'apt --fix-broken install' with no packages (or specify a solution).

```
```
ata@untwist-dev:~$ sudo apt --fix-broken install
Reading package lists... Done
Building dependency tree       
Reading state information... Done
Correcting dependencies... Done
The following additional packages will be installed:
  linux-image-5.4.0-148-generic
Suggested packages:
  fdutils linux-doc | linux-source-5.4.0 linux-tools
The following NEW packages will be installed:
  linux-image-5.4.0-148-generic
0 upgraded, 1 newly installed, 0 to remove and 120 not upgraded.
7 not fully installed or removed.
Need to get 0 B/10.5 MB of archives.
After this operation, 13.7 MB of additional disk space will be used.
Do you want to continue? [Y/n] y
dpkg: unrecoverable fatal error, aborting:
 unable to fill /var/lib/dpkg/updates/tmp.i with padding: No space left on device
E: Write error - write (28: No space left on device)
E: Sub-process /usr/bin/dpkg returned an error code (2)
```

### cleared cache
```
sudo apt-get clean
```

### larger files 
```
sudo du -h --max-depth=1 / | sort -rh
du: cannot access '/proc/2873727/task/2873727/fd/4': No such file or directory
du: cannot access '/proc/2873727/task/2873727/fdinfo/4': No such file or directory
du: cannot access '/proc/2873727/fd/3': No such file or directory
du: cannot access '/proc/2873727/fdinfo/3': No such file or directory
51G	/
44G	/var
2.8G	/usr
2.4G	/home
1.7G	/snap
347M	/run
110M	/boot
6.7M	/etc
544K	/root
68K	/tmp
24K	/mnt
16K	/opt
16K	/lost+found
4.0K	/srv
4.0K	/media
0	/sys
0	/proc
0	/dev



root@untwist-dev:/var# sudo du -h --max-depth=1 . | sort -rh
43G	.
42G	./lib
1.1G	./log
111M	./cache
9.1M	./projects
232K	./backups
76K	./snap
36K	./tmp
32K	./www
28K	./spool
4.0K	./opt
4.0K	./mail
4.0K	./local
4.0K	./crash


root@untwist-dev:/var/lib# sudo du -h --max-depth=1 . | sort -rh
42G	.
41G	./docker
903M	./snapd
302M	./mlocate
174M	./apt
46M	./dpkg
30M	./sss
3.1M	./command-not-found
1.8M	./fwupd
620K	./systemd
608K	./usbutils
452K	./containerd
292K	./cloud
124K	./ucf
52K	./ipa-client
40K	./polkit-1
40K	./apache2
36K	./certmonger
36K	./PackageKit
28K	./pam
24K	./emacsen-common
20K	./update-notifier
16K	./grub
12K	./ubuntu-advantage
12K	./initramfs-tools
12K	./dictionaries-common
12K	./AccountsService
8.0K	./vim
8.0K	./update-manager
8.0K	./sudo
8.0K	./shim-signed
8.0K	./logrotate
8.0K	./chrony
8.0K	./apport
4.0K	./usb_modeswitch
4.0K	./unattended-upgrades
4.0K	./udisks2
4.0K	./ubuntu-release-upgrader
4.0K	./tpm
4.0K	./python
4.0K	./private
4.0K	./plymouth
4.0K	./os-prober
4.0K	./misc
4.0K	./man-db
4.0K	./landscape
4.0K	./ieee-data
4.0K	./git
4.0K	./dhcp
4.0K	./dbus
4.0K	./boltd


root@untwist-dev:/var/lib/docker# sudo du -h --max-depth=1 . | sort -rh
41G	.
22G	./overlay2
19G	./containers
229M	./volumes
5.6M	./image
104K	./network
88K	./buildkit
16K	./plugins
4.0K	./trust
4.0K	./swarm
4.0K	./runtimes



```

### Please see above that the docker's OverlayFS (Overlay File System) storage driver occupies 22G and containers occupy 19G, the total space available on the root is 49G. So I have no space to install or run any additional packages, I will go ahead and remove docker from this system along with dependencies.

I have created a backup of the folder that Asis asked, as can be seen above