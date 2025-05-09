using project_alpha_0._1.osztalyok;
using project_alpha_0._1.userCoontrol_ok;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class parkinGarageEdit : Form
    {
        HttpRequestek request = new HttpRequestek();
        public parkinGarageEdit()
        {
            InitializeComponent();
            Start();

            LoadUserControls();

            button1.Click += backBtn;
            button2.Click += addBtn;

            textBox1.TextChanged += btnSearch_Click;
        }
        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            this.BackColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Parkolóház választó";
            label2.Text = "Szűrés névre:";

            button1.Text = "Vissza";
            button2.Text = "Hozzáadás";

            int label1Mid = label1.Width / 2;
            int panel1Mid = panel1.Width / 2;
            int button1Mid = button1.Width / 2;
            int button2Mid = button2.Width / 2;

            label1.Left = this.Width / 2 - label1Mid;
            panel1.Left = this.Width / 2 - panel1Mid;
            button1.Left = panel1.Left;
            button2.Left = button1.Left + button1.Width + 6;
            label2.Left = button2.Left + button2.Width + 6;
            label2.Top = button1.Top + button1.Height / 2 - label2.Height / 2;
            textBox1.Top = button1.Top + button1.Height / 2 - textBox1.Height / 2;
            textBox1.Left = panel1.Left + panel1.Width - textBox1.Width;
        }

        public void backBtn(object s, EventArgs e)
        {
            const string message = "Biztosan vissza akarsz lépni?";
            const string caption = "Visszalépés";
            var result = MessageBox.Show(message, caption, MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                this.Close();
                Menu menuForm = new Menu();
                menuForm.Show();
            }
        }

        public void addBtn(object s, EventArgs e)
        {
            this.Close();
            parkinGarageEditAdd addForm = new parkinGarageEditAdd();
            addForm.Show();
        }

        private async void LoadUserControls(string search = "")
        {

            try
            {
                int xPosition = 0;
                int yPosition = 0;
                int controlWidth = (panel1.Width - SystemInformation.VerticalScrollBarWidth) / 2;
                panel1.Width = controlWidth * 2 + SystemInformation.VerticalScrollBarWidth;
                int controlHeight = 175;

                HttpRequestek request = new HttpRequestek();

                List<Parkhouses> parkhouses = await request.getParkhouses();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    parkhouses = parkhouses.Where(u => u.name.Contains(search)).ToList();
                }

                panel1.Controls.Clear();


                for (int i = 0; i < parkhouses.Count; i++)
                {
                    var ph = parkhouses[i];

                    var userControlParkhouses = new userControlParkhouses()
                    {
                        phID = ph.id,
                        textBox1 = { Text = ph.name.ToString() },
                        textBox2 = { Text = ph.capacity.ToString() },
                        textBox3 = { Text = ph.address.ToString() },
                        textBox4 = { Text = ph.opening.ToString() },
                        textBox5 = { Text = ph.closing.ToString() },
                    };

                    userControlParkhouses.Location = new Point(xPosition, yPosition);
                    userControlParkhouses.Size = new Size(controlWidth, controlHeight);

                    panel1.Controls.Add(userControlParkhouses);

                    if ((i + 1) % 2 == 0)
                    {
                        xPosition = 0;
                        yPosition += controlHeight;
                    }
                    else
                    {
                        xPosition += controlWidth;
                    }
                }
            }
            catch (Exception e)
            {
                MessageBox.Show("Hiba történt: ", e.Message);
            }
        }

        private void btnSearch_Click(object sender, EventArgs e)
        {
            string searchText = textBox1.Text.Trim();
            LoadUserControls(searchText);
        }
    }
}
