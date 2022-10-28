VERSION=1.0.0
NAME=Course-NeciBook
ICONS=./public/assets/icons

PKGER=node ./node_modules/electron-packager/bin/electron-packager.js
ZIP=node ../zip.js
7ZIP-MAC=../bin/darwin/7zz a -mx7
7ZIP-LINUX=../bin/linux/7zz a -mx7
7ZIP-WIN=../bin/win32/7zz.exe a -mx7
Builder=node builder.js

ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
ELECTRON_VERSION=14.0.0
IGNORE=(node_modules|src|build|Makefile|releases|public|test|coverage|back|webpack.config.*.js|.gitignore|package-lock.json|README.md|app-server.js|serverWorker.js|.gitlab-ci.yml|craco.config.js|zip.js)
BUILD=ELECTRON_MIRROR=$(ELECTRON_MIRROR) $(PKGER) . $(NAME) --asar --asar-unpack *.node --overwrite --out ./build --electron-version $(ELECTRON_VERSION) --app-version $(VERSION) --ignore="$(IGNORE)"
ELECTON=./node_modules/electron/cli.js

i:
	yarn
clean:
	rm -rf dist node_modules build releases node/crc64/cpp-addon/node_modules node/crc64/electron-crc64-prebuild/node_modules node/ossstore/node_modules
dev:
	NODE_ENV=development ${ELECTON} . --inspect=5858
debug:
	NODE_ENV=development ${ELECTON} . --inspect-brk=5858

run:
	npm run start:web

build:
	npm run build:prod

web:
	rm -f releases/$(VERSION)/$(NAME)-web-x64-$(VERSION).7z && mkdir -p releases/$(VERSION)
	cd dist && $(7ZIP-MAC) ../releases/$(VERSION)/$(NAME)-web-x64-$(VERSION).7z ./*
win:
	$(BUILD) --platform=win32 --arch=x64 --icon=$(ICONS)/favicon.ico
	cp -rf $(ICONS) build/$(NAME)-win32-x64/resources
	#rm -f releases/$(VERSION)/$(NAME)-win32-x64-$(VERSION).zip && mkdir -p releases/$(VERSION)
	#cd build && $(ZIP) ../releases/$(VERSION)/$(NAME)-win32-x64-$(VERSION).zip $(NAME)-win32-x64/
	rm -f releases/$(VERSION)/$(NAME)-win32-x64-$(VERSION).7z && mkdir -p releases/$(VERSION)
	cd build && $(7ZIP-MAC) ../releases/$(VERSION)/$(NAME)-win32-x64-$(VERSION).7z $(NAME)-win32-x64/*
linux:
	$(BUILD) --platform=linux --arch=x64
	cp -rf $(ICONS) build/$(NAME)-linux-x64/resources
	rm -f releases/$(VERSION)/$(NAME)-linux-x64-$(VERSION).zip && mkdir -p releases/$(VERSION)
	cd build && $(ZIP) ../releases/$(VERSION)/$(NAME)-linux-x64-$(VERSION).zip $(NAME)-linux-x64/
mac:
	$(BUILD) --platform=darwin --arch=x64 --icon=$(ICONS)/favicon.icns
	cp -rf $(ICONS) build/$(NAME)-darwin-x64/$(NAME).app/Contents/Resources
	rm -f releases/$(VERSION)/$(NAME)-darwin-x64-$(VERSION).zip && mkdir -p releases/$(VERSION)
	cd build && $(ZIP) ../releases/$(VERSION)/$(NAME)-darwin-x64-$(VERSION).zip $(NAME)-darwin-x64/
dmg:
	rm build/$(NAME)-darwin-x64/LICENSE* build/$(NAME)-darwin-x64/version || continue
	ln -s /Applications/ build/$(NAME)-darwin-x64/Applications || continue
	cp $(ICONS)/favicon.icns build/$(NAME)-darwin-x64/.VolumeIcon.icns
	# mkdir -p build/$(NAME)-darwin-x64/.background
	# cp $(ICONS)/background.tiff build/$(NAME)-darwin-x64/.background
	rm -f releases/$(VERSION)/$(NAME)-$(VERSION).dmg || continue
	hdiutil create -size 250M -format UDZO -srcfolder build/$(NAME)-darwin-x64 -o releases/$(VERSION)/$(NAME)-$(VERSION).dmg
zip:
	rm -f releases/$(VERSION)/$(NAME)-web-x64-$(VERSION).zip && mkdir -p releases/$(VERSION)
	cd dist && $(ZIP) ../releases/$(VERSION)/$(NAME)-web-x64-$(VERSION).zip ./
exe:web win
	rm -f releases/$(VERSION)/$(NAME)-win32-x64-$(VERSION).exe releases/$(VERSION)/$(NAME)-web-x64-$(VERSION).exe && mkdir -p releases/$(VERSION)
	$(Builder) releases/$(VERSION)/$(NAME)-web-x64-$(VERSION).exe releases/$(VERSION)/$(NAME)-web-x64-$(VERSION).7z
	$(Builder) releases/$(VERSION)/$(NAME)-win32-x64-$(VERSION).exe releases/$(VERSION)/$(NAME)-win32-x64-$(VERSION).7z
all:zip win linux dmg
	@echo 'Done'
asar:
	mkdir -p releases/$(VERSION)/darwin-x64 && cp build/$(NAME)-darwin-x64/$(NAME).app/Contents/Resources/app.asar releases/$(VERSION)/darwin-x64
	mkdir -p releases/$(VERSION)/win32-x64 && cp build/$(NAME)-win32-x64/resources/app.asar releases/$(VERSION)/win32-x64
	mkdir -p releases/$(VERSION)/win32-ia32 && cp build/$(NAME)-win32-ia32/resources/app.asar releases/$(VERSION)/win32-ia32
	mkdir -p releases/$(VERSION)/linux-x64 && cp build/$(NAME)-linux-x64/resources/app.asar releases/$(VERSION)/linux-x64
	mkdir -p releases/$(VERSION)/linux-ia32 && cp build/$(NAME)-linux-ia32/resources/app.asar releases/$(VERSION)/linux-ia32

.PHONY:build