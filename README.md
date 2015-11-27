# Modern Editor
Modern Editor is a code editor for Windows 10 (Universal App Platform), built on ReactJS, WinJS and Ace.

*The project is still in its early stages*

## Screenshot
![Imgur](http://i.imgur.com/l7fJ4Vt.png)

## Building
#### Requirements
1. [Node.JS](https://nodejs.org/en/) (Recommended: v4.x)
2. [Git](https://git-scm.com/)
3. [Visual Studio 2015](https://www.visualstudio.com) (with Windows 10 SDK)

#### Instructions
```bash
npm install -g gulp // Install gulp complier
git clone https://github.com/modern-editor/modern-editor.git
cd modern-editor
npm install
npm prepare //To copy winjs and ace-builds to necessary location
```

Open `ModernEditor.sln` with **Visual Studio**. Go to **Debug > Start without Debugging** or press **Ctrl+F5** to run the app.

## Localization
[Modern Lab Localization Center](http://localization.modernlab.xyz)

## License
[GPL](https://github.com/modern-editor/modern-editor/blob/master/LICENSE)
