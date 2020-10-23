import setuptools

with open("README.md", "r") as file_header:
    long_description = file_header.read()

setuptools.setup(
    name="cppl",
    version="1.0.0",
    author="danie_llimas",
    author_email="amedlimas97@gmail.com",
    description="Simple OpenCV and Ubidots app to count people in images",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS independent",
    ],
    python_requires='>=3.6',
)