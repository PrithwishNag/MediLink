# Path to the file containing the version
version_file_path = 'version.txt'

def read_version(file_path):
    """
    Reads the version from the given file or creates a new file with '0.0.0' if it does not exist.

    :param file_path: Path to the file containing the version.
    :return: The version as a string.
    """
    try:
        with open(file_path, 'r') as file:
            version = file.read().strip()
        return version
    except FileNotFoundError:
        # Create the file with the initial version '0.0.0'
        with open(file_path, 'w') as file:
            file.write('0.0.0')
        return '0.0.0'

def write_version(file_path, version):
    """
    Writes the version to the given file.

    :param file_path: Path to the file where the version will be written.
    :param version: The version to write.
    """
    with open(file_path, 'w') as file:
        file.write(version)

def increment_version(version):
    """
    Increments the patch part of the version.

    :param version: The current version as a string.
    :return: The incremented version as a string.
    """
    major, minor, patch = map(int, version.split('.'))
    patch += 1  # Increment the patch part
    return f"{major}.{minor}.{patch}"

def main():
    # Read the current version or initialize it if file doesn't exist
    current_version = read_version(version_file_path)

    # Increment the version
    new_version = increment_version(current_version)

    # Write the new version back to the file
    write_version(version_file_path, new_version)

    # Print only the new version
    print(new_version)

if __name__ == '__main__':
    main()
