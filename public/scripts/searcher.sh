# !/bin/bash
# source /home/eneko/miniconda3/etc/profile.d/conda.sh


pname="$1"
comand="$(whereis $pname)"

echo $comand
