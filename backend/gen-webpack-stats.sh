#!/bin/sh

WEBPACK="webpack-stats.json"
files=`find ./static/js ./static/css -type f`
last=`echo "${files}" | wc -l`

echo '{"status":"done","publicPath":"/static/","chunks":{"main":[' > ${WEBPACK}

i=1
for file in ${files}
do
    name=`echo "${file}" | sed -e 's|^\./static/||'`
    publicPath=`echo "${file}" | sed -e 's/^\.//'`

    echo "{\"name\": \"${name}\"," >> ${WEBPACK}
    echo "\"publicPath\": \"${publicPath}\"" >> ${WEBPACK}
    if [ "${i}" -eq "${last}" ]; then
        echo '}' >> ${WEBPACK}
    else
        echo '},' >> ${WEBPACK}
    fi

    i=`expr ${i} + 1`
done

echo ']}}' >> ${WEBPACK}
