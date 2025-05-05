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
using static System.Windows.Forms.VisualStyles.VisualStyleElement;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ToolBar;

namespace project_alpha_0._1
{
    public partial class reservationEdit : Form
    {
        public reservationEdit()
        {
            InitializeComponent();
            Start();
            button1.Click += backBtn;
            button2.Click += addBtn;

            LoadUserControls();

            textBox1.TextChanged += btnSearch_Click;
        }
        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            this.BackColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);
            label2.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Foglalások kezelése";
            label2.Text = "Szűrés userID-ra:";
            button1.Text = "Vissza";
            button2.Text = "Hozzáadás";

            int label1Mid = label1.Width / 2;
            int button1Mid = button1.Width / 2;
            int button2Mid = button2.Width / 2;
            int panel1Mid = panel1.Width / 2;

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
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                this.Hide();
                Menu menuForm = new Menu();
                menuForm.ShowDialog();
                //this.Close();
            }
        }

        public void addBtn(object s, EventArgs e)
        {
            //const string message = "Fejlesztés alatt";
            //const string caption = "Hiba";
            //var result = MessageBox.Show(message, caption,
            //                             MessageBoxButtons.OK,
            //                             MessageBoxIcon.Error);

            this.Hide();
            reservationEditAdd reservationEditAddForm = new reservationEditAdd();
            reservationEditAddForm.Show();
        }

        private async void LoadUserControls(string kereses = "")
        {

            try
            {
                int xPosition = 0;
                int yPosition = 0;
                int controlWidth = (panel1.Width - SystemInformation.VerticalScrollBarWidth) / 2;
                panel1.Width = controlWidth * 2 + SystemInformation.VerticalScrollBarWidth;
                int controlHeight = 175;

                HttpRequestek request = new HttpRequestek();

                List<Reservations> reservations = await request.getReservations();

                if (!string.IsNullOrWhiteSpace(kereses))
                {
                    reservations = reservations
                        .Where(u => u.reservation_owner_id.Equals(kereses))
                        .ToList();
                }

                panel1.Controls.Clear();


                for (int i = 0; i < reservations.Count; i++)
                {
                    var res = reservations[i];

                    

                    var userControlReservation = new userControlReservation()
                    {
                        resID = res.id,
                        textBox1 = { Text = res.active.ToString() },
                        textBox2 = { Text = res.sum.ToString() },
                        textBox3 = { Text = res.reservation_owner_id.ToString() },
                        textBox4 = { Text = res.park_slot.ToString() },
                        textBox5 = { Text = res.parkhouse_id.ToString() },
                    };

                    

                    userControlReservation.Location = new Point(xPosition, yPosition);
                    userControlReservation.Size = new Size(controlWidth, controlHeight);

                    panel1.Controls.Add(userControlReservation);

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
                MessageBox.Show("Valami nagyon el van baszva ", e.Message);
            }
        }

        private void btnSearch_Click(object sender, EventArgs e)
        {
            string keresestext = textBox1.Text.Trim();
            LoadUserControls(keresestext);
        }
    }
}
