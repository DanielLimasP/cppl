# People counting with OpenCV.

This is the foundation for the AI project.

### Some useful links

* [Link to the tutorial](https://ubidots.com/blog/people-counting-with-opencv-python-and-ubidots/)
* [Link to unittesting](https://docs.python.org/3/library/unittest.html)
* [Link to packaging](https://packaging.python.org/tutorials/packaging-projects/)
* [Link to requests guide](https://realpython.com/python-requests/)
* [Link to color](https://pypi.org/project/colorclass/)

## Installation

### Clone the repo

```bash
git clone REPO_URL
```

### cd to it in console

```bash
cd cppl
```

## To use it execute one of this commands

```bash
python src/main.py -i PATH_TO_IMAGE     # Reads and detects people in a single local stored image
python src/main.py -c true              # Attempts to detect people using webcam
python src/main.py -f true              # Attempts to detect faces using the webcam
python src/main.py -R true              # Resets the info of a store
```
Additionally, you can add the -E flag to start the program in exit door mode

## Contributing
Just ask for permission.

