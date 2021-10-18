fx_version 'adamant'
game 'gta5'

ui_page "html/index.html"

client_scripts {
    'client/*.lua',
    'config.lua'
   -- '@cs-video-call/client/hooks/core.lua'
}

server_scripts {
    "@mysql-async/lib/MySQL.lua",
    'server/main.lua',
    'config.lua',
   -- '@cs-video-call/server/hooks/core.lua'
}

files {
    'html/*.html',
    'html/js/*.js',
    'html/img/*.png',
    'html/css/*.css',
    'html/fonts/*.ttf',
    'html/fonts/*.otf',
    'html/fonts/*.woff',
    'html/img/backgrounds/*.png',
    'html/img/apps/*.png',
    'html/img/icons/*.svg',
    'html/img/icons/*.png',
}