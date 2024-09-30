

const DoctorsPage = () => {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    }
    return (
    <div>
      <div className="flex items-center gap-10">
        <h1>Medicos</h1>
        <Button
          size="lg"
          variant="default"
          className="bg-red-500"
          onClick={() => handleNavigation(PATH_OPTIONS.newDoctor)} //HACER NEW DOCTOR
        >
          Agregar
        </Button>
      </div>
    </div>
    );
}

export default DoctorsPage;